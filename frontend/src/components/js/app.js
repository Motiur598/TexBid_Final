document.addEventListener('DOMContentLoaded', () => {
    // ===== MOBILE HAMBURGER MENU =====
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    let isMobileMenuOpen = false;

    if (mobileMenuToggle && mobileMenuPanel) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isMobileMenuOpen = !isMobileMenuOpen;
            console.log("Menu toggled", isMobileMenuOpen);
            toggleMobileMenu(isMobileMenuOpen);
        });

        // Close menu when clicking a navigation link
        mobileMenuPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                isMobileMenuOpen = false;
                toggleMobileMenu(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen &&
                !mobileMenuPanel.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                isMobileMenuOpen = false;
                toggleMobileMenu(false);
            }
        });

        // Close menu on window resize past breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && isMobileMenuOpen) {
                isMobileMenuOpen = false;
                toggleMobileMenu(false);
            }
        });
    }

    function toggleMobileMenu(open) {
        if (!mobileMenuPanel) return;

        // Update ARIA attribute
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', open.toString());
        }

        if (open) {
            // Show the panel
            mobileMenuPanel.classList.remove('hidden');
            // Allow a repaint so the transition triggers
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mobileMenuPanel.style.maxHeight = mobileMenuPanel.scrollHeight + 'px';
                });
            });
            // Swap icons: hide hamburger, show close
            if (hamburgerIcon) {
                hamburgerIcon.classList.add('scale-0', 'opacity-0');
                hamburgerIcon.classList.remove('scale-100', 'opacity-100');
            }
            if (closeIcon) {
                closeIcon.classList.remove('scale-0', 'opacity-0');
                closeIcon.classList.add('scale-100', 'opacity-100');
            }
            // Lock body scroll on mobile
            document.body.style.overflow = 'hidden';
        } else {
            // Collapse the panel
            mobileMenuPanel.style.maxHeight = '0';
            // Swap icons: show hamburger, hide close
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('scale-0', 'opacity-0');
                hamburgerIcon.classList.add('scale-100', 'opacity-100');
            }
            if (closeIcon) {
                closeIcon.classList.add('scale-0', 'opacity-0');
                closeIcon.classList.remove('scale-100', 'opacity-100');
            }
            // Restore body scroll
            document.body.style.overflow = '';

            // After the transition ends, hide the panel from the DOM
            mobileMenuPanel.addEventListener('transitionend', function handler() {
                if (!isMobileMenuOpen) {
                    mobileMenuPanel.classList.add('hidden');
                }
                mobileMenuPanel.removeEventListener('transitionend', handler);
            });
        }
    }

    // ===== NAVBAR SCROLL SHADOW =====
    const navBar = document.querySelector('nav');
    if (navBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navBar.classList.add('shadow-lg', 'bg-opacity-95');
                navBar.classList.remove('shadow-md', 'bg-opacity-100');
            } else {
                navBar.classList.add('shadow-md', 'bg-opacity-100');
                navBar.classList.remove('shadow-lg', 'bg-opacity-95');
            }
        });
    }

    // Logging initialization
    console.log("TexBid Premium Interface Initialized.");

    // ===== UI-LEVEL RBAC =====
    const currentRole = document.body.getAttribute('data-current-role');
    if (currentRole && currentRole !== 'guest') {
        applyUI_RBAC(currentRole);
    }

    // ===== MOBILE ORDERS LINK ROLE DETECTION =====
    (async function() {
        const mobileMyOrdersLink = document.getElementById('mobileMyOrdersLink');
        if (mobileMyOrdersLink) {
            try {
                const response = await fetch('/api/user/role');
                if (response.ok) {
                    const data = await response.json();
                    if (data.role === 'SUPPLIER') {
                        mobileMyOrdersLink.href = '/supplier/orders';
                    } else {
                        mobileMyOrdersLink.href = '/buyer/orders';
                    }
                }
            } catch (error) {
                console.error('Error detecting user role for mobile menu:', error);
            }
        }
    })();
});

/**
 * Utility function to enforce UI-level Role-Based Access Control (RBAC).
 * Scans the DOM for elements with a `data-role` attribute. If the `currentRole`
 * does not match the element's `data-role` (case-insensitive), the element is hidden.
 * 
 * @param {string} currentRole - The role of the currently logged-in user.
 */
function applyUI_RBAC(currentRole) {
    if (!currentRole) return;
    const role = currentRole.toUpperCase();
    
    // Find all elements with a data-role attribute
    const restrictedElements = document.querySelectorAll('[data-role]');
    
    restrictedElements.forEach(el => {
        const requiredRole = el.getAttribute('data-role').toUpperCase();
        
        // If the current role doesn't match the required role (and it's not a generic ADMIN override scenario)
        if (role !== requiredRole && role !== 'ADMIN') {
            el.classList.add('hidden');
        } else {
            // Optional: If you want to ensure it's unhidden if the role is correct and was previously hidden
            // el.classList.remove('hidden');
        }
    });
}
