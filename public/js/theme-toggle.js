/**
 * Theme toggle functionality for SmartAC
 * Handles switching between light and dark themes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check for device preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Create theme toggle switch
    const themeToggleHTML = `
        <div class="theme-toggle">
            <input type="checkbox" id="theme-toggle-checkbox" class="theme-toggle-checkbox" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'checked' : ''}>
            <label for="theme-toggle-checkbox" class="theme-toggle-label">
                <span class="theme-toggle-ball"></span>
            </label>
        </div>
    `;

    // Insert toggle into the theme-toggle-container
    const themeToggleContainer = document.querySelector('.theme-toggle-container');
    if (themeToggleContainer) {
        themeToggleContainer.innerHTML = themeToggleHTML;
    } else {
        // Create a new container if not found
        const navbarNav = document.querySelector('#navbarNav');
        if (navbarNav) {
            const navItems = navbarNav.querySelector('ul');
            if (navItems) {
                const themeToggleItem = document.createElement('li');
                themeToggleItem.className = 'nav-item d-flex align-items-center ms-2';
                themeToggleItem.innerHTML = themeToggleHTML;
                navItems.insertBefore(themeToggleItem, navItems.firstChild);
            }
        }
    }

    // Add event listener to theme toggle
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', toggleTheme);
    }
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update checkbox state
        const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = newTheme === 'dark';
        }
    }
    
    // Function to update theme toggle appearance
    function updateThemeToggle(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.classList.add('theme-toggle-checked');
            } else {
                themeToggle.classList.remove('theme-toggle-checked');
            }
        }
    }
});
