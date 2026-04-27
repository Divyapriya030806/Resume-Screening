# AI Resume Screening using NLP

A modern full-stack web application for intelligent resume screening using Natural Language Processing (NLP) techniques. Built with Python Flask backend and responsive HTML/CSS/JavaScript frontend.

## 🚀 Features

- **Resume Upload**: Support for PDF and DOCX file formats
- **NLP Analysis**: Advanced text processing using spaCy and NLTK
- **Skill Extraction**: Automatic identification of relevant skills
- **Job Matching**: Calculate match percentage between resume and job description
- **Modern UI**: Glassmorphism design with dark theme and smooth animations
- **Responsive**: Fully responsive design for desktop and mobile devices
- **Real-time Processing**: Fast analysis with loading indicators

## 🛠️ Technologies Used

### Backend
- **Python Flask**: Lightweight web framework
- **NLTK**: Natural Language Toolkit for text preprocessing
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX text extraction

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: Interactive functionality and API calls
- **Font Awesome**: Icons and visual elements

## 📋 Prerequisites

- Python 3.8 or higher
- pip package manager

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/resume-screening-nlp.git
   cd resume-screening-nlp
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
project/
│── app.py                    # Flask application
│── templates/
│   └── index.html           # Main HTML template
│── static/
│   ├── style.css            # CSS styles
│   └── script.js            # JavaScript functionality
│── uploads/                 # Temporary file uploads (auto-created)
│── requirements.txt         # Python dependencies
└── README.md               # Project documentation
```

## 🎯 How It Works

1. **Upload Resume**: Users can drag & drop or select PDF/DOCX files
2. **Job Description**: Paste the job requirements in the text area
3. **Analysis**: The system extracts text from the resume and processes it using NLP
4. **Skill Matching**: Compares extracted skills with job requirements
5. **Scoring**: Calculates a match percentage using TF-IDF and cosine similarity
6. **Results**: Displays match score, matched skills, and missing skills

## 🔍 NLP Processing Pipeline

1. **Text Extraction**: Extract raw text from PDF/DOCX files
2. **Preprocessing**: Lowercase, remove punctuation, tokenize, remove stopwords
3. **Skill Extraction**: Match against predefined skill database
4. **Similarity Calculation**: Use TF-IDF vectorization and cosine similarity
5. **Result Generation**: Compute match score and identify skill gaps

## 🎨 UI Features

- **Dark Theme**: Modern dark color scheme with blue/purple gradients
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Mobile-first approach with breakpoints
- **Interactive Elements**: Hover effects, loading states, and micro-interactions

## 🚀 Deployment

### For Development
The application runs on Flask's built-in development server.

### For Production
Consider deploying to:
- **Heroku**: Easy Flask deployment
- **Render**: Free tier available
- **AWS/GCP/Azure**: Cloud platforms
- **Docker**: Containerized deployment

### Environment Variables
Set `FLASK_ENV=production` for production deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- spaCy for NLP processing
- NLTK for text preprocessing
- Scikit-learn for machine learning utilities
- Font Awesome for icons
- Google Fonts for typography

## 📞 Contact

For questions or suggestions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Python, Flask, and modern web technologies**