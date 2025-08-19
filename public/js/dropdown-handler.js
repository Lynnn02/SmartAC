document.addEventListener('DOMContentLoaded', function() {
    // Handle nested dropdowns on desktop
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');
    
    dropdownSubmenus.forEach(function(submenu) {
        const dropdownToggle = submenu.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Close all other submenus
                const allSubmenus = document.querySelectorAll('.dropdown-submenu .dropdown-menu');
                allSubmenus.forEach(function(menu) {
                    if (menu !== submenu.querySelector('.dropdown-menu')) {
                        menu.classList.remove('show');
                    }
                });
                
                // Toggle current submenu
                const submenuDropdown = submenu.querySelector('.dropdown-menu');
                submenuDropdown.classList.toggle('show');
            });
        }
    });
    
    // Handle mobile modules dropdown positioning
    const mobileModulesDropdown = document.getElementById('mobileModulesDropdown');
    if (mobileModulesDropdown) {
        mobileModulesDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.querySelector('.mobile-modules-dropdown');
            dropdown.classList.toggle('show');
            
            // Position the dropdown
            if (dropdown.classList.contains('show')) {
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-submenu') && !e.target.closest('#mobileModulesDropdown')) {
            document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(function(menu) {
                menu.classList.remove('show');
            });
            
            const mobileDropdown = document.querySelector('.mobile-modules-dropdown');
            if (mobileDropdown && mobileDropdown.classList.contains('show')) {
                mobileDropdown.classList.remove('show');
                mobileDropdown.style.display = 'none';
            }
        }
    });
});
