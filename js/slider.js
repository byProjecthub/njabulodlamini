/* ========================================
   Testimonials Slider / Carousel
   ======================================== */

(function() {
    'use strict';

    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, totalCards - cardsPerView);

    // ========================================
    // Initialize
    // ========================================

    function init() {
        createDots();
        updateSlider();
        startAutoPlay();
        addEventListeners();
    }

    function getCardsPerView() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1023) return 2;
        return 3;
    }

    // ========================================
    // Create Dots
    // ========================================

    function createDots() {
        dotsContainer.innerHTML = '';
        const dotCount = maxIndex + 1;

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // ========================================
    // Slider Controls
    // ========================================

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // from CSS
        const translateX = -(currentIndex * (cardWidth + gap));

        track.style.transform = `translateX(${translateX}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateSlider();
    }

    // ========================================
    // Auto Play
    // ========================================

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // ========================================
    // Touch / Swipe Support
    // ========================================

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // ========================================
    // Resize Handler
    // ========================================

    function handleResize() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            maxIndex = Math.max(0, totalCards - cardsPerView);
            currentIndex = Math.min(currentIndex, maxIndex);
            createDots();
            updateSlider();
        }
    }

    // ========================================
    // Event Listeners
    // ========================================

    function addEventListeners() {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        // Touch events
        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Pause on hover
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoPlay();
            }
        });

        // Resize
        window.addEventListener('resize', handleResize);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

})();
