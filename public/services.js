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

// ----------------

const changingTexts = [
    "Building Stronger & Sustainable Metal Supply Chain",
    "Revolutionizing Metal Fabrication with Industry 4.0",
    "Connecting Suppliers and Buyers Seamlessly",
    "Optimizing the Metal Supply Chain Network"
];

const images = [
    "assets/supply.jpg",
    "assets/revo_4.jpg",
    "assets/buyers.jpg",
    "assets/network.jpg"
];

let currentIndex = 0;

function updateContent(initialLoad = false) {
    const textElement = document.getElementById('changing-text');
    const imageElement = document.getElementById('changing-image');

    if (!initialLoad) {
        // Fade out text and image with GSAP
        textElement.style.opacity = 0;
        gsap.to(imageElement, { opacity: 0, y: 20, duration: 0.3 });
    }

    setTimeout(() => {
        // Update content
        textElement.textContent = changingTexts[currentIndex];
        imageElement.src = images[currentIndex];

        // Fade in text and image with GSAP
        textElement.style.opacity = 1;
        gsap.to(imageElement, { opacity: 1, y: 0, duration: 0.3 });

        // Move to the next index
        currentIndex = (currentIndex + 1) % changingTexts.length;
    }, initialLoad ? 0 : 500); // Skip delay on initial load
}

// Initialize with the first content
updateContent(true);

// Start the interval for content updates
setInterval(updateContent, 3000);


// ------------


document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.fabrication-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Removed the 'visible' class addition
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the card is visible
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        const header = item.querySelector('.feature-header');
        header.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});


(function() {
emailjs.init("qdhJoAGgx1_rqzZBF"); // Replace with your actual EmailJS user ID
})();

document.addEventListener('DOMContentLoaded', function() {
const dynamicText = document.getElementById('dynamic-text'); // Updated to target the new class
const texts = [
"Metal Fabrication",
"E-Factory",
"Recycling",
"Logistics"
];
let textIndex = 0;

function changeText() {
dynamicText.textContent = texts[textIndex]; // Use the new variable name
textIndex = (textIndex + 1) % texts.length;
}

setInterval(changeText, 3000);

document.getElementById('contactFormm').addEventListener('submit', function(event) {
event.preventDefault();

const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const mobile = document.getElementById('mobile').value;
const subject = document.getElementById('subject').value;
const message = document.getElementById('message').value;

emailjs.send("service_5don2am", "template_s4d12sp", {
    from_name: name,
    from_email: email,
    phone: mobile,
    subject: subject,
    message: message
}).then(function(response) {
    console.log('SUCCESS!', response.status, response.text);
    alert('Your message has been sent successfully!');
    document.getElementById('contactFormm').reset();
}, function(error) {
    console.log('FAILED...', error);
    alert('Failed to send the message. Please try again later.');
});
});
});
