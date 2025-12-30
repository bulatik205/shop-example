function isDesktopDevice() {
    const isWideScreen = window.innerWidth >= 768;
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return (isWideScreen && hasMouse && !isTouchDevice) || !isMobileUserAgent;
}

if (isDesktopDevice()) {
    const container = document.getElementById('spotlight');
    let isCursorInside = false;

    function updateSpotlightPosition(x, y) {
        if (isCursorInside) {
            container.style.setProperty('--x', `${x}px`);
            container.style.setProperty('--y', `${y}px`);
        }
    }

    container.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        updateSpotlightPosition(x, y);
    });

    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        updateSpotlightPosition(x, y);
    });

    container.addEventListener('mouseenter', () => {
        isCursorInside = true;
        container.classList.remove('cursor-outside');
    });

    container.addEventListener('touchstart', () => {
        isCursorInside = true;
        container.classList.remove('cursor-outside');
    });

    container.addEventListener('mouseleave', () => {
        isCursorInside = false;
        container.classList.add('cursor-outside');
    });

    container.addEventListener('touchend', () => {
        isCursorInside = false;
        container.classList.add('cursor-outside');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const scrolledClass = 'scrolled';
    const scrollThreshold = 50;
    
    function updateHeaderOnScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add(scrolledClass);
        } else {
            header.classList.remove(scrolledClass);
        }
    }
    
    updateHeaderOnScroll();
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
});
