// ============================================
// Main JavaScript for Equitas Website
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initRotatingHeadlines();
    initContactForm();
});

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);

        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            // Handle home link
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate offset for fixed navbar
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Rotating Headlines
// ============================================
function initRotatingHeadlines() {
    const headlines = [
        'Tech-powered growth accelerator and investment partner',
        'Digital transformation specialists',
        'Web4 agents of change',
        'Accelerating transformation through strategy, design and innovation',
        'Helping transformative technologies reach the real world'
    ];

    const headlineElement = document.getElementById('rotatingHeadline');
    let currentIndex = 0;

    function rotateHeadline() {
        // Fade out
        headlineElement.classList.add('fade-out');

        // Wait for fade out, then change text and fade in
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % headlines.length;
            headlineElement.textContent = headlines[currentIndex];
            headlineElement.classList.remove('fade-out');
            headlineElement.classList.add('fade-in');

            // Remove fade-in class after animation
            setTimeout(() => {
                headlineElement.classList.remove('fade-in');
            }, 500);
        }, 500);
    }

    // Start rotation every 4.5 seconds
    setInterval(rotateHeadline, 4500);
}

// ============================================
// Contact Form Handling
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Log to console
        console.log('=================================');
        console.log('Contact Form Submission');
        console.log('=================================');
        console.log('Name:', formData.name);
        console.log('Email:', formData.email);
        console.log('Message:', formData.message);
        console.log('Submitted at:', formData.timestamp);
        console.log('=================================');

        // Show success message (you can customize this)
        showSuccessMessage();

        // Reset form
        contactForm.reset();
    });
}

// ============================================
// Success Message Display
// ============================================
function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Thank you! Your message has been received.';
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #00b894;
        color: white;
        padding: 16px 32px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideDown 0.3s ease;
    `;

    // Add animation keyframes if not already present
    if (!document.querySelector('#successMessageStyle')) {
        const style = document.createElement('style');
        style.id = 'successMessageStyle';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Append to body
    document.body.appendChild(successMessage);

    // Remove after 3 seconds
    setTimeout(() => {
        successMessage.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 3000);
}

// ============================================
// Optional: Highlight Active Nav Link on Scroll
// ============================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);
}

// Uncomment the line below to enable scroll spy
// initScrollSpy();
