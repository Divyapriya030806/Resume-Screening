from flask import Flask, render_template, request, jsonify
import os
import re
from werkzeug.utils import secure_filename
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import PyPDF2
from docx import Document

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Predefined skills list (can be expanded)
SKILLS = [
    'python', 'java', 'javascript', 'c++', 'c#', 'html', 'css', 'sql', 'mysql', 'postgresql',
    'mongodb', 'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'hibernate',
    'machine learning', 'deep learning', 'nlp', 'data analysis', 'pandas', 'numpy', 'tensorflow',
    'pytorch', 'scikit-learn', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows'
]

def extract_text_from_pdf(file_path):
    """Extract text from PDF file."""
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file."""
    doc = Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def get_stopwords():
    """Get English stopwords with a safe fallback."""
    try:
        return set(stopwords.words('english'))
    except LookupError:
        return {
            'a', 'an', 'the', 'and', 'or', 'but', 'if', 'in', 'on', 'at', 'by', 'for', 'with',
            'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
            'above', 'below', 'to', 'from', 'up', 'down', 'over', 'under', 'again', 'further',
            'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
            'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
            'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'don',
            'should', 'now'
        }


def tokenize_text(text):
    """Tokenize text safely, falling back when NLTK data is unavailable."""
    try:
        return word_tokenize(text)
    except LookupError:
        return re.findall(r"\b\w+\b", text)


def preprocess_text(text):
    """Preprocess text: lowercase, remove punctuation, tokenize."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = tokenize_text(text)
    stop_words = get_stopwords()
    tokens = [token for token in tokens if token not in stop_words]
    return ' '.join(tokens)

def extract_skills(text):
    """Extract skills from text using predefined list."""
    text_lower = text.lower()
    found_skills = [skill for skill in SKILLS if skill in text_lower]
    return list(set(found_skills))  # Remove duplicates

def calculate_match_score(resume_text, job_desc_text):
    """Calculate match score using Jaccard similarity."""
    resume_words = set(resume_text.lower().split())
    job_words = set(job_desc_text.lower().split())
    
    intersection = resume_words.intersection(job_words)
    union = resume_words.union(job_words)
    
    if not union:
        return 0.0
    
    return round((len(intersection) / len(union)) * 100, 2)

def find_matched_missing_skills(resume_skills, job_skills):
    """Find matched and missing skills."""
    matched = list(set(resume_skills) & set(job_skills))
    missing = list(set(job_skills) - set(resume_skills))
    return matched, missing

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get job description
        job_description = request.form.get('job_description', '')
        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        # Get uploaded file
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file uploaded'}), 400

        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Check file extension
        allowed_extensions = {'pdf', 'docx'}
        if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({'error': 'Invalid file type. Only PDF and DOCX are allowed'}), 400

        # Save file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract text from resume
        if filename.lower().endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_path)
        elif filename.lower().endswith('.docx'):
            resume_text = extract_text_from_docx(file_path)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        # Clean up uploaded file
        os.remove(file_path)

        # Preprocess texts
        resume_processed = preprocess_text(resume_text)
        job_processed = preprocess_text(job_description)

        # Extract skills
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_description)

        # Calculate match score
        match_score = calculate_match_score(resume_processed, job_processed)

        # Find matched and missing skills
        matched_skills, missing_skills = find_matched_missing_skills(resume_skills, job_skills)

        return jsonify({
            'match_score': match_score,
            'matched_skills': matched_skills,
            'missing_skills': missing_skills
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)