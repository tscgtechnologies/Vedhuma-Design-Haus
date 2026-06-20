/* ==========================================================================
   VEDHUMA DESIGN HAUS - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. DYNAMIC NAVIGATION BAR STICKY STATE
    const header = document.querySelector('.site-header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Check immediately on load


    // 2. MOBILE NAVIGATION DRAWER
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeDrawer = document.querySelector('.drawer-close');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    const drawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu(isOpen) {
        menuToggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            drawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        } else {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (closeDrawer) {
        closeDrawer.addEventListener('click', () => toggleMobileMenu(false));
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close mobile drawer when clicking any link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    });


    // 3. ACTIVE NAVBAR LINK ON SCROLL
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const drawerLinks = document.querySelectorAll('.mobile-drawer .mobile-nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update Desktop links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Update Mobile Drawer links
                drawerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();


    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-element');

    const revealObserverOptions = {
        root: null, // Viewport
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -40px 0px' // Margins to trigger slightly early/late
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve after revealing to prevent repeating animation (premium feel)
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // 5. FLOATING BACK TO TOP BUTTON
    const backToTopBtn = document.querySelector('.back-to-top');

    function handleBackToTopVisibility() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', handleBackToTopVisibility);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // 6. ANTI-GRAVITY MOUSE PARALLAX (Buttery smooth lerped animation)
    const hero = document.getElementById('home');
    const floatingElements = document.querySelectorAll('.anti-gravity-container .float-element');
    
    // Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;
    
    // Current positions (for LERP damping interpolation)
    let currentX = 0;
    let currentY = 0;
    
    // Smoothness damping factor (0.1 means slow and elastic, 1 means instant)
    const ease = 0.08;
    
    // Handle mouse move
    if (hero && window.innerWidth >= 1024) {
        window.addEventListener('mousemove', (e) => {
            // Normalize mouse position relative to center of screen: -1 to +1
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });
    }

    // Animation Loop
    function animateParallax() {
        // Only run computations and transformations if on desktop size
        if (window.innerWidth >= 1024) {
            // LERP interpolation formula: current = current + (target - current) * ease
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;

            floatingElements.forEach(element => {
                const depth = parseFloat(element.getAttribute('data-depth')) || 0.1;
                
                // Calculate pixel offset (max offset 60px)
                const moveX = currentX * depth * 80;
                const moveY = currentY * depth * 80;
                
                // Combine custom up-down floating offset with mouse parallax
                // Use translate3d for hardware-accelerated rendering performance
                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        }
        
        // Request next frame recursively
        requestAnimationFrame(animateParallax);
    }
    
    // Start animation loop
    animateParallax();


    // 7. PREFERS-REDUCED-MOTION ACCESSIBILITY SETTING CHECK
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function checkReducedMotion() {
        if (motionQuery.matches) {
            // Disable mouse movements completely
            mouseX = 0;
            mouseY = 0;
            currentX = 0;
            currentY = 0;
            
            // Mark all items as visible immediately
            revealElements.forEach(element => {
                element.classList.add('reveal-visible');
            });
        }
    }
    
    motionQuery.addEventListener('change', checkReducedMotion);
    checkReducedMotion();
});
