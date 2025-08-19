// SmartAC Custom JavaScript for Enhanced UI/UX

document.addEventListener('DOMContentLoaded', function() {
    // Apply interactive classes to elements
    applyInteractiveClasses();
    
    // Initialize animations with staggered delays
    initializeAnimations();
    
    // Initialize interactive navigation
    initializeInteractiveNavigation();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
    
    // Initialize 3D model viewer enhancements
    initialize3DModelViewer();
    
    // Initialize practical steps enhancements
    initializePracticalSteps();
    
    // Initialize AR buttons
    initializeARButtons();
    
    // Initialize component cards
    initializeComponentCards();
    
    // Initialize admin dashboard interactions
    initializeAdminDashboard();
    
    // Initialize form interactions
    initializeForms();
    
    // Add parallax effects
    initializeParallaxEffects();
    
    // Initialize counter animations
    initializeCounters();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize pricing tabs
    initializePricingTabs();
});

// Apply interactive classes to elements
function applyInteractiveClasses() {
    // Convert regular cards to interactive cards
    document.querySelectorAll('.card:not(.interactive-card)').forEach(card => {
        card.classList.add('interactive-card');
    });
    
    // Add interactive classes to lists
    document.querySelectorAll('ul:not(.navbar-nav):not(.dropdown-menu):not(.pagination):not(.interactive-list)').forEach(list => {
        list.classList.add('interactive-list');
    });
    
    // Add glow effect to primary buttons
    document.querySelectorAll('.btn-primary:not(.btn-glow)').forEach(btn => {
        btn.classList.add('btn-glow');
    });
    
    // Add 3D hover effect to component cards
    document.querySelectorAll('.component-card:not(.hover-3d)').forEach(card => {
        card.classList.add('hover-3d');
    });
    
    // Add interactive navigation classes
    document.querySelectorAll('.navbar-nav:not(.nav-interactive)').forEach(nav => {
        nav.classList.add('nav-interactive');
    });
    
    // Add gradient border to cards in important sections
    document.querySelectorAll('.component-information .card, .related-components .card').forEach(card => {
        card.classList.add('gradient-border');
    });
    
    // Add icons to card titles if they don't have any
    document.querySelectorAll('.card-title').forEach(title => {
        if (!title.querySelector('i') && !title.previousElementSibling) {
            const icon = document.createElement('i');
            icon.className = 'bi bi-gear-fill me-2 card-icon';
            title.prepend(icon);
        }
    });
}

// Initialize animations with staggered delays
function initializeAnimations() {
    // Fade in cards with staggered delay
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Slide in elements from right
    const rightElements = document.querySelectorAll('.component-information, .related-components');
    rightElements.forEach((element, index) => {
        element.classList.add('slide-in-right');
        element.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    });
    
    // Slide in elements from left
    const leftElements = document.querySelectorAll('.practical-step, .model-viewer');
    leftElements.forEach((element, index) => {
        element.classList.add('slide-in-left');
        element.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    });
    
    // Add float animation to specific elements
    document.querySelectorAll('.feature-icon, .ar-visualization img').forEach(element => {
        element.classList.add('float');
    });
    
    // Add pulse animation to call-to-action buttons
    document.querySelectorAll('.btn-primary[type="submit"], .btn-primary.btn-lg').forEach(button => {
        button.classList.add('pulse');
    });
}

// Initialize interactive navigation
function initializeInteractiveNavigation() {
    // Add active class to current nav item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        }
        
        // Add hover animation to nav icons
        const icon = link.querySelector('i');
        if (icon) {
            link.addEventListener('mouseenter', () => {
                icon.classList.add('pulse');
            });
            link.addEventListener('mouseleave', () => {
                icon.classList.remove('pulse');
            });
        }
    });
    
    // Add dropdown animation
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (menu && toggle) {
            toggle.addEventListener('click', () => {
                menu.classList.add('fade-in');
            });
        }
    });
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize tooltips
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize popovers
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Add tooltips to buttons that don't have them
    document.querySelectorAll('.btn:not([data-bs-toggle="tooltip"])').forEach(btn => {
        if (btn.title || btn.getAttribute('aria-label')) {
            btn.setAttribute('data-bs-toggle', 'tooltip');
            btn.setAttribute('data-bs-placement', 'top');
            if (!btn.title && btn.getAttribute('aria-label')) {
                btn.title = btn.getAttribute('aria-label');
            }
            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                new bootstrap.Tooltip(btn);
            }
        }
    });
}

// Initialize 3D model viewer enhancements
function initialize3DModelViewer() {
    const modelViewer = document.querySelector('.component-viewer, .model-container');
    if (modelViewer) {
        // Add loading spinner if not present
        if (!modelViewer.querySelector('.loading-spinner') && modelViewer.textContent.includes('Loading')) {
            const loadingText = Array.from(modelViewer.childNodes).find(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.includes('Loading'));
            
            if (loadingText) {
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner mb-3';
                modelViewer.insertBefore(spinner, loadingText);
            }
        }
        
        // Enhance model controls
        const modelControls = document.querySelector('.model-controls');
        if (modelControls) {
            modelControls.querySelectorAll('button').forEach(button => {
                if (!button.querySelector('i')) {
                    const buttonText = button.textContent.trim();
                    let iconClass = 'bi-arrows-fullscreen';
                    
                    if (buttonText.includes('Rotate')) iconClass = 'bi-arrow-repeat';
                    if (buttonText.includes('Zoom')) iconClass = 'bi-zoom-in';
                    if (buttonText.includes('Reset')) iconClass = 'bi-arrow-counterclockwise';
                    if (buttonText.includes('AR')) iconClass = 'bi-phone';
                    
                    const icon = document.createElement('i');
                    icon.className = `bi ${iconClass} me-2`;
                    button.prepend(icon);
                }
            });
        }
    }
}

// Initialize practical steps enhancements
function initializePracticalSteps() {
    const practicalSteps = document.querySelectorAll('.practical-step');
    practicalSteps.forEach((step, index) => {
        // Add step number attribute for CSS pseudo-element
        step.setAttribute('data-step', index + 1);
        
        // Add animation with staggered delay
        step.style.animationDelay = `${index * 0.1}s`;
        
        // Enhance AR buttons
        const arButton = step.querySelector('button, .btn');
        if (arButton && arButton.textContent.includes('AR')) {
            arButton.classList.add('ar-button');
            
            // Add icon if not present
            if (!arButton.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'bi bi-phone';
                arButton.prepend(icon);
            }
        }
    });
}

// Initialize AR buttons
function initializeARButtons() {
    document.querySelectorAll('button, .btn').forEach(button => {
        if (button.textContent.includes('AR') || button.textContent.includes('Lihat dalam AR')) {
            button.classList.add('ar-button');
            
            // Add icon if not present
            if (!button.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'bi bi-phone me-2';
                button.prepend(icon);
            }
            
            // Add pulse effect to icon
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.add('pulse');
            }
        }
    });
}

// Initialize component cards
function initializeComponentCards() {
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            const title = this.querySelector('.card-title');
            if (title) title.style.color = '#000';
            
            // Add scale effect to image
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            const title = this.querySelector('.card-title');
            if (title) title.style.color = '';
            
            // Reset image scale
            const img = this.querySelector('img');
            if (img) img.style.transform = '';
        });
    });
}

// Initialize admin dashboard interactions
function initializeAdminDashboard() {
    // Add hover effects to user management cards
    document.querySelectorAll('.user-management, .teacher-accounts, .student-accounts').forEach(card => {
        card.classList.add('interactive-card');
    });
    
    // Add pulse effect to quick action buttons
    document.querySelectorAll('.quick-actions .btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) icon.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) icon.classList.remove('pulse');
        });
    });
}

// Initialize form interactions
function initializeForms() {
    // Add focus effects to form inputs
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add animation to form submission buttons
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('pulse');
            }
        });
    });
}

// Initialize parallax effects
function initializeParallaxEffects() {
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPosition = `50% ${scrollPosition * 0.05}px`;
        });
    }
    
    // Add parallax effect to dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 300) {
                dashboardHeader.style.transform = `translateY(${scrollPosition * 0.1}px)`;
            }
        });
    }
}

// Initialize counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Function to toggle dark/light mode (for future implementation)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Function to show/hide password
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

// Initialize pricing tabs functionality
function initializePricingTabs() {
    const digitalTab = document.getElementById('digital-tab');
    const physicalTab = document.getElementById('physical-tab');
    const digitalContent = document.getElementById('digital-content');
    const physicalContent = document.getElementById('physical-content');
    
    if (digitalTab && physicalTab && digitalContent && physicalContent) {
        // Set up click event for digital access tab
        digitalTab.addEventListener('click', function() {
            // Update active tab styling
            digitalTab.style.backgroundColor = '#d4af37';
            digitalTab.style.color = '#000';
            physicalTab.style.backgroundColor = 'transparent';
            physicalTab.style.color = '#d4af37';
            
            // Show/hide content
            digitalContent.style.display = 'block';
            physicalContent.style.display = 'none';
        });
        
        // Set up click event for physical units tab
        physicalTab.addEventListener('click', function() {
            // Update active tab styling
            physicalTab.style.backgroundColor = '#d4af37';
            physicalTab.style.color = '#000';
            digitalTab.style.backgroundColor = 'transparent';
            digitalTab.style.color = '#d4af37';
            
            // Show/hide content
            digitalContent.style.display = 'none';
            physicalContent.style.display = 'block';
        });
    }
}
