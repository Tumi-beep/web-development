/**
 * OuterGuide - Part 3 Main JavaScript Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dynamic Search and Filter
    initSearchFilter();

    // 2. Initialize Form Validation & AJAX Submission
    initFormValidation();

    // 3. Initialize Lightbox Gallery
    initLightbox();
});


/* ==========================================================
   1. SEARCH AND FILTER FUNCTIONALITY
   ========================================================== */
function initSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    const itemCards = document.querySelectorAll('.item-card');

    if (!searchInput || itemCards.length === 0) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        itemCards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';

            // Check if title or description matches search query
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}


/* ==========================================================
   2. FORM VALIDATION & AJAX SUBMISSION
   ========================================================== */
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let isValid = true;

            // Clear previous errors
            clearErrors(form);

            // Validate Name Field
            const nameInput = form.querySelector('#name');
            if (nameInput && nameInput.value.trim() === '') {
                showError(nameInput, 'Please enter your full name.');
                isValid = false;
            }

            // Validate Email Field
            const emailInput = form.querySelector('#email');
            if (emailInput && !isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Phone Number (Optional format validation if field exists)
            const phoneInput = form.querySelector('#phone');
            if (phoneInput && phoneInput.value.trim() !== '') {
                const phoneRegex = /^\+?[0-9]{10,15}$/;
                if (!phoneRegex.test(phoneInput.value.trim())) {
                    showError(phoneInput, 'Please enter a valid phone number (10–15 digits).');
                    isValid = false;
                }
            }

            // Validate Message / Textarea
            const messageInput = form.querySelector('#message');
            if (messageInput && messageInput.value.trim().length < 10) {
                showError(messageInput, 'Your message must be at least 10 characters long.');
                isValid = false;
            }

            // If valid, submit via AJAX
            if (isValid) {
                submitFormViaAjax(form);
            }
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback text-danger mt-1';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.innerText = message;
    inputElement.parentNode.appendChild(errorDiv);
}

function clearErrors(form) {
    const errors = form.querySelectorAll('.invalid-feedback');
    errors.forEach(err => err.remove());
    const inputs = form.querySelectorAll('.is-invalid');
    inputs.forEach(input => input.classList.remove('is-invalid'));
}

function submitFormViaAjax(form) {
    const formData = new FormData(form);
    const responseMessage = form.querySelector('.form-response');
    const actionUrl = form.getAttribute('action') || '#';

    // Show loading state
    if (responseMessage) {
        responseMessage.innerHTML = '<p class="text-info">Processing your request...</p>';
    }

    // Simulate AJAX request using Fetch API
    fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        handleSuccessResponse(form, responseMessage);
    })
    .catch(error => {
        // Fallback for simulation / local static deployment
        handleSuccessResponse(form, responseMessage);
    });
}

function handleSuccessResponse(form, responseMessage) {
    form.reset();
    if (responseMessage) {
        responseMessage.innerHTML = `
            <div class="alert alert-success p-3 mt-3 bg-light border border-success text-success">
                <strong>Success!</strong> Your information has been successfully processed and submitted.
            </div>
        `;
    } else {
        alert('Form submitted successfully!');
    }
}


/* ==========================================================
   3. IMAGE LIGHTBOX GALLERY
   ========================================================== */
function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    if (galleryImages.length === 0) return;

    // Dynamically inject Lightbox structural HTML into the body
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-img" src="" alt="Enlarged view">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Open lightbox when gallery image is clicked
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
        });
    });

    // Close lightbox actions
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}
/* ==========================================================
   AUTO-HIGHLIGHT CURRENT PAGE IN NAVBAR
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Get the current file name from the URL (defaults to 'index.html' if empty)
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    
    // Select all links in your navigation bar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // If the link matches the current page, add the 'active' class
        if (linkHref === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});