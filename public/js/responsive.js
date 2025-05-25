/**
 * Responsive behavior enhancements for SmartAC
 * Handles mobile menu toggling and responsive UI adjustments
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        // Create backdrop element for mobile sidebar
        const backdrop = document.createElement('div');
        backdrop.classList.add('sidebar-backdrop');
        document.body.appendChild(backdrop);
        
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            backdrop.classList.toggle('show');
            document.body.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking on backdrop
        backdrop.addEventListener('click', function() {
            sidebar.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Handle table responsiveness
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Wrap tables in a div with overflow-x: auto for mobile
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('table-responsive');
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
    
    // Adjust component viewer height based on screen size
    const adjustComponentViewerHeight = () => {
        const componentViewers = document.querySelectorAll('.component-viewer');
        const windowWidth = window.innerWidth;
        
        componentViewers.forEach(viewer => {
            if (windowWidth < 768) {
                viewer.style.height = '300px';
            } else if (windowWidth < 992) {
                viewer.style.height = '400px';
            } else {
                viewer.style.height = '500px';
            }
        });
    };
    
    // Run on load and on resize
    adjustComponentViewerHeight();
    window.addEventListener('resize', adjustComponentViewerHeight);
    
    // Add swipe gestures for mobile (optional enhancement)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    const handleSwipe = () => {
        if (sidebar) {
            const swipeDistance = touchEndX - touchStartX;
            // Right to left swipe (close sidebar)
            if (swipeDistance < -50 && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                document.querySelector('.sidebar-backdrop').classList.remove('show');
                document.body.classList.remove('sidebar-open');
            }
            // Left to right swipe (open sidebar)
            else if (swipeDistance > 50 && !sidebar.classList.contains('show')) {
                sidebar.classList.add('show');
                document.querySelector('.sidebar-backdrop').classList.add('show');
                document.body.classList.add('sidebar-open');
            }
        }
    };
});
