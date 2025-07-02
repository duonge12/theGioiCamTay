// Menu Active Management
class MenuActive {
    constructor() {
        this.init();
    }

    init() {
        this.setActiveMenu();
    }

    setActiveMenu() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.admin-sidebar ul li a');
        
        // Remove all active classes first
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class based on current page
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            
            // Check if current path matches the href
            if (href && href !== '#' && currentPath.includes(href)) {
                item.classList.add('active');
            }
            
            // Special case for dashboard (index.html)
            if (currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath.includes('index.html')) {
                if (href === '#' || href === './index.html') {
                    item.classList.add('active');
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MenuActive();
}); 