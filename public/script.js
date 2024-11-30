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