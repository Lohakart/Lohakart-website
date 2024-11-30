// hamburger----

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

// ---------
const image = document.querySelector('.animated-image');
const image2 = document.querySelector('.animated-image2');
let direction = 1;
let position = 0;

function animate() {
    position += 0.5 * direction;
    if (position > 20 || position < -20) {
        direction *= -1;
    }
    image.style.transform = `translateY(${position}px)`;
    image2.style.transform = `translateY(${position}px)`;
    requestAnimationFrame(animate);
}

animate();

