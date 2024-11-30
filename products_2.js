// ----------------

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    let isOpen = false;
  
    function toggleMobileNav() {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        isOpen = !isOpen;
        
        if (isOpen) {
            body.style.overflow = 'hidden';
            hamburger.style.transform = 'rotate(90deg)';
        } else {
            body.style.overflow = '';
            hamburger.style.transform = 'rotate(0deg)';
        }
    }
  
    hamburger.addEventListener('click', toggleMobileNav);
  
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = mobileNav.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInside && mobileNav.classList.contains('open')) {
            toggleMobileNav();
        }
    });
  
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
            toggleMobileNav();
        }
    });
  });


// Automatically advances the slides every 3 seconds
 const carouselElement = document.querySelector('#carouselExampleCaptions');

 let myCarousel = new bootstrap.Carousel(carouselElement, {
     interval: 3000, // Automatically change slide every 3 seconds
     ride: 'carousel' // Start cycling immediately
 });

 // Manually control the carousel with buttons
 const prevButton = document.querySelector('.carousel-control-prev');
 const nextButton = document.querySelector('.carousel-control-next');

 prevButton.addEventListener('click', () => {
     myCarousel.prev();
 });

 nextButton.addEventListener('click', () => {
     myCarousel.next();
 });

