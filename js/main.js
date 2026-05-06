/* ========================================
   Main JavaScript - Navigation & Theme
   ======================================== */

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    const dropdowns = document.querySelectorAll('.dropdown');

    // ========================================
    // Theme Toggle
    // ========================================

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        showToast(`Switched to ${newTheme} mode`, 'success');
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ========================================
    // Navbar Scroll Effect
    // ========================================

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ========================================
    // Mobile Menu
    // ========================================

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================
    // Dropdown Menu (Mobile)
    // ========================================

    function handleDropdown(e) {
        if (window.innerWidth <= 1023) {
            e.preventDefault();
            const dropdown = e.currentTarget.parentElement;
            dropdown.classList.toggle('active');
        }
    }

    // ========================================
    // Smooth Scroll
    // ========================================

    function smoothScroll(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;

        const href = target.getAttribute('href');
        if (href === '#') return;

        const element = document.querySelector(href);
        if (element) {
            e.preventDefault();
            const offset = navbar.offsetHeight + 20;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            closeMobileMenu();
        }
    }

    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.service-card, .portfolio-card, .testimonial-card, .skill-item, .stat-item, .about-text, .about-image'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate');
            observer.observe(el);
        });
    }

    // ========================================
    // Stats Counter Animation
    // ========================================

    function initStatsCounter() {
        const stats = document.querySelectorAll('.stat-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    const numberEl = target.querySelector('.stat-number');
                    animateCounter(numberEl, countTo);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target >= 10 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // ========================================
    // Typewriter Effect
    // ========================================

    function initTypewriter() {
        const typewriter = document.querySelector('.typewriter');
        if (!typewriter) return;

        const text = typewriter.textContent;
        typewriter.textContent = '';

        let i = 0;
        const speed = 100;

        function type() {
            if (i < text.length) {
                typewriter.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        setTimeout(type, 1000);
    }

    // ========================================
    // Toast Notification
    // ========================================

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ========================================
    // Active Navigation Link
    // ========================================

    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // Parallax Effect (Subtle)
    // ========================================

    function initParallax() {
        const orbs = document.querySelectorAll('.gradient-orb');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            orbs.forEach((orb, index) => {
                const speed = 0.3 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ========================================
    // Form Validation Helper
    // ========================================

    window.validateForm = function(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                input.style.borderColor = '#ef4444';
            } else {
                input.classList.remove('error');
                input.style.borderColor = '';
            }

            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    input.style.borderColor = '#ef4444';
                }
            }
        });

        return isValid;
    };


    // ========================================
    // Tools Carousel Slider
    // ========================================

    function initToolsSlider() {
        const toolsTrack = document.getElementById('toolsTrack');
        const prevBtn = document.getElementById('toolsPrev');
        const nextBtn = document.getElementById('toolsNext');

        if (!toolsTrack || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const cards = toolsTrack.querySelectorAll('.tool-card');
        const totalCards = cards.length;

        function getCardsPerView() {
            if (window.innerWidth <= 767) return 1;
            if (window.innerWidth <= 1023) return 2;
            return 3;
        }

        let cardsPerView = getCardsPerView();
        let maxIndex = Math.max(0, totalCards - cardsPerView);

        function updateSlider() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const translateX = -(currentIndex * (cardWidth + gap));
            toolsTrack.style.transform = `translateX(${translateX}px)`;

            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                maxIndex = Math.max(0, totalCards - cardsPerView);
                currentIndex = Math.min(currentIndex, maxIndex);
                updateSlider();
            }
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        toolsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        toolsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateSlider();
            }
        }, { passive: true });

        updateSlider();
    }

    // ========================================
    // Event Listeners
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initScrollAnimations();
        initStatsCounter();
        initTypewriter();
        initParallax();
            initToolsSlider();

        // Scroll events
        window.addEventListener('scroll', () => {
            handleScroll();
            setActiveNavLink();
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Mobile menu
        hamburger.addEventListener('click', toggleMobileMenu);

        // Dropdowns
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            link.addEventListener('click', handleDropdown);
        });

        // Smooth scroll
        document.addEventListener('click', smoothScroll);

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1023) {
                closeMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    });

    // Expose showToast globally
    window.showToast = showToast;

})();
