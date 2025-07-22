document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');
    const navBar = document.getElementById('navbar'); // Renamed to avoid conflict
    
    function toggleMobileMenu() {
        const isOpen = hamburger.classList.contains('active');
        
        if (!isOpen) {
            // Opening the menu
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
            navBar.style.transform = 'translateY(0)';
            navBar.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            // Closing the menu
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
    
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) { // Only for mobile
                toggleMobileMenu();
                
                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navBar.contains(e.target);
        const isMenuOpen = hamburger.classList.contains('active');
        
        if (!isClickInsideNav && isMenuOpen && window.innerWidth <= 992) {
            toggleMobileMenu();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect - using navBar variable that was already declared
    let lastScrollTop = 0;
    let isScrollingDown = false;
    let scrollTimeout;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
        
        // Only apply hide/show behavior on desktop
        if (window.innerWidth > 992) {
            // Check if user is scrolling down
            isScrollingDown = scrollTop > lastScrollTop && scrollTop > 200;
            
            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            if (isScrollingDown) {
                // Scrolling down - hide navbar
                navBar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navBar.style.transform = 'translateY(0)';
                
                // Set a timeout to keep the navbar visible when reaching the top
                if (scrollTop === 0) {
                    scrollTimeout = setTimeout(() => {
                        navBar.style.transform = 'translateY(0)';
                    }, 1000);
                }
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }
    
    // Throttle the scroll event for better performance
    let scrollThrottle;
    window.addEventListener('scroll', () => {
        window.clearTimeout(scrollThrottle);
        scrollThrottle = setTimeout(handleScroll, 66); // ~15fps
    }, false);
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                document.querySelector(`.nav-links a[href*=${sectionId}]`).classList.add('active');
            } else {
                const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
                if (navLink) {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Show/hide back to top button with smooth transition
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Throttle scroll event for better performance
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(animateProgressBars, 100);
        isScrolling = setTimeout(animateTimeline, 100);
        // Animation handled by AOS or fallback
        toggleBackToTop();
        updateActiveNavLink();
    });

    // Smooth scroll to top with easing function
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 800; // milliseconds
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (easeInOutCubic)
            const easeInOutCubic = t => t < 0.5 
                ? 4 * t * t * t 
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate progress bars when they come into view
    const progressBars = document.querySelectorAll('.progress');
    
    const animateProgressBars = () => {
        progressBars.forEach(progress => {
            const rect = progress.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                progress.style.width = progress.style.width;
            }
        });
    };
    
    // Initial check for progress bars in viewport
    animateProgressBars();
    
    // Timeline Animation
    const timelineSection = document.querySelector('.timeline-section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line');
    
    // Function to check if timeline items are in viewport
    function animateTimeline() {
        if (!timelineSection) return;
        
        // Update timeline line height
        if (timelineLine) {
            const firstItem = timelineItems[0];
            const lastItem = timelineItems[timelineItems.length - 1];
            
            if (firstItem && lastItem) {
                const start = firstItem.getBoundingClientRect().top + window.scrollY;
                const end = lastItem.getBoundingClientRect().bottom + window.scrollY;
                const height = end - start;
                
                timelineLine.style.height = `${height}px`;
            }
        }
        
        // Animate timeline items
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const itemVisible = 150;
            
            if (itemTop < window.innerHeight - itemVisible) {
                // Add staggered delay for each item
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 150);
            }
        });
    }
    
    // Initial check on page load
    setTimeout(animateTimeline, 500);
    
    // Timeline step animations
    const timelineSteps = document.querySelectorAll('.process-step');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;
        
        timelineSteps.forEach(step => {
            const stepTop = step.getBoundingClientRect().top;
            const stepBottom = step.getBoundingClientRect().bottom;
            
            if (stepTop < triggerPoint && stepBottom > 0) {
                step.classList.add('visible');
            }
        });
    };
    
    // Initial check
    checkIfInView();
    
    // Floating Contact Button with Animations
    const floatingContact = document.querySelector('.floating-contact');
    const contactButton = document.querySelector('.contact-button');
    const contactOptions = document.querySelectorAll('.contact-option');
    
    if (contactButton) {
        let isAnimating = false;
        
        // Toggle contact options
        const toggleContactMenu = (e) => {
            if (isAnimating) return;
            isAnimating = true;
            
            e.stopPropagation();
            const isActive = floatingContact.classList.toggle('active');
            contactButton.classList.toggle('active', isActive);
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = contactButton.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            ripple.classList.add('ripple-effect');
            
            contactButton.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 1000);
            
            // Reset animation flag after transition
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        };
        
        contactButton.addEventListener('click', toggleContactMenu);
        
        // Close contact options when clicking outside
        document.addEventListener('click', (e) => {
            if (!floatingContact.contains(e.target)) {
                floatingContact.classList.remove('active');
                contactButton.classList.remove('active');
            }
        });
        
        // Add hover effect to contact options
        contactOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                if (floatingContact.classList.contains('active')) {
                    option.style.transform = 'translateY(-3px) scale(1.1) rotate(10deg)';
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (floatingContact.classList.contains('active')) {
                    option.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                }
            });
        });
        
        // Touch device support
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        
        contactButton.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            contactButton.classList.add('touch-active');
        }, { passive: true });
        
        contactButton.addEventListener('touchend', (e) => {
            contactButton.classList.remove('touch-active');
            
            // Only trigger click if it was a short tap, not a swipe
            const touchEndTime = Date.now();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const timeDiff = touchEndTime - touchStartTime;
            const distX = Math.abs(touchEndX - touchStartX);
            const distY = Math.abs(touchEndY - touchStartY);
            
            if (timeDiff < 200 && distX < 10 && distY < 10) {
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                contactButton.dispatchEvent(clickEvent);
            }
        }, { passive: true });
        
        // Prevent scrolling when interacting with the button on touch devices
        contactButton.addEventListener('touchmove', (e) => {
            // Only prevent default if user is trying to scroll over the button
            const touchY = e.touches[0].clientY;
            if (Math.abs(touchY - touchStartY) > 5) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Recalculate on window resize
    window.addEventListener('resize', checkIfInView);
    
    // Fallback animation if AOS is not loaded
    if (typeof AOS === 'undefined') {
        // Fallback animations are handled by the visible class added above
    }
    
    // Event listeners
    window.addEventListener('resize', animateTimeline);
    window.addEventListener('scroll', () => {
        animateTimeline();
        animateProgressBars();
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Initialize AOS (Animate On Scroll) if you want to add more animations
    // Make sure to include AOS library in your HTML
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Preloader (optional)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});
