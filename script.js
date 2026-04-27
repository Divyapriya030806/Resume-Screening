// DOM Elements
const analyzeForm = document.getElementById('analyze-form');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('resume');
const resultsDiv = document.getElementById('results');
const loadingOverlay = document.getElementById('loading');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contact-form');

// Navigation Toggle for Mobile
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after clicking
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Highlight Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Drag and Drop Functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        updateUploadArea(files[0]);
    }
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        updateUploadArea(e.target.files[0]);
    }
});

function updateUploadArea(file) {
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    const currentInput = fileInput;
    uploadArea.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <p><strong>${fileName}</strong> (${fileSize})</p>
        <p>Click to change file</p>
    `;

    // Put the existing input back into the upload area so the selected file stays attached
    uploadArea.appendChild(currentInput);
    currentInput.style.position = 'absolute';
    currentInput.style.top = '0';
    currentInput.style.left = '0';
    currentInput.style.width = '100%';
    currentInput.style.height = '100%';
    currentInput.style.opacity = '0';
    currentInput.style.cursor = 'pointer';
}


// Form Submission
analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = analyzeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.dataset.originalText || submitBtn.innerHTML;
    submitBtn.dataset.originalText = originalText;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    const formData = new FormData(analyzeForm);

    // Show loading overlay
    loadingOverlay.classList.remove('hidden');

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            displayResults(data);
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError('An error occurred while analyzing the resume. Please try again.');
    } finally {
        loadingOverlay.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

function displayResults(data) {
    const match_score = data.match_score ?? 0;
    const matched_skills = Array.isArray(data.matched_skills) ? data.matched_skills : [];
    const missing_skills = Array.isArray(data.missing_skills) ? data.missing_skills : [];

    // Update score
    document.getElementById('match-score').textContent = match_score;

    // Update matched skills
    const matchedSkillsDiv = document.getElementById('matched-skills');
    matchedSkillsDiv.innerHTML = '';
    if (matched_skills.length > 0) {
        matched_skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            matchedSkillsDiv.appendChild(skillTag);
        });
    } else {
        matchedSkillsDiv.innerHTML = '<p style="color: #888; font-style: italic;">No matching skills found</p>';
    }

    // Update missing skills
    const missingSkillsDiv = document.getElementById('missing-skills');
    missingSkillsDiv.innerHTML = '';
    if (missing_skills.length > 0) {
        missing_skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag missing';
            skillTag.textContent = skill;
            missingSkillsDiv.appendChild(skillTag);
        });
    } else {
        missingSkillsDiv.innerHTML = '<p style="color: #888; font-style: italic;">All required skills present</p>';
    }

    // Show results with animation and enforce visible display
    resultsDiv.classList.remove('hidden');
    resultsDiv.style.display = 'grid';
    resultsDiv.style.animation = 'fadeInUp 0.5s ease-out';

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.dataset.originalText || submitBtn.innerHTML;
    submitBtn.dataset.originalText = originalText;

    // Show processing state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate sending (in real app, this would be an API call)
    setTimeout(() => {
        showSuccess('The message has been sent and you will be notified shortly.');

        // Reset button and form
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
    }, 800);
});

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 212, 255, 0.15);
        color: #e0f7ff;
        border: 1px solid rgba(0, 212, 255, 0.35);
        padding: 16px 22px;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
        z-index: 10000;
        max-width: 340px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    toast.innerHTML = `
        <i class="fas fa-check-circle" style="color: #00d4ff; font-size: 1.2rem;"></i>
        <span style="font-size: 0.95rem; line-height: 1.4;">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.25s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 250);
    }, 2500);
}

function showError(message) {
    // Create error alert
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span style="margin-left: 10px;">${message}</span>
    `;

    document.body.appendChild(alertDiv);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 5000);
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Store original text for submit buttons (except contact form)
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.type === 'submit' && !btn.closest('#contact-form')) {
            btn.dataset.originalText = btn.innerHTML;
            btn.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                setTimeout(() => {
                    this.innerHTML = this.dataset.originalText;
                }, 2000);
            });
        }
    });
});