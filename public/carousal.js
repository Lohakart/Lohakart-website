const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const navContainer = document.querySelector('.carousel-nav');
const typingTextElement = document.getElementById('typing-text');

// Define text content for each slide - making sure they match the image order
const slideTexts = [
    "Metal Supply", // First slide - metal-fabrication-services image
    "Metal Fabrication", // Second slide - metal-trading-b2b-solutions image
    "Metal Procurement", // Third slide - metal-processing-b2b-solutions image
    "Metal Recycling", // Fourth slide - metal-recycling-solutions image
    "Carbon Accounting",
    "Metal Casting / Forging", // Fifth slide - metal-casting-services image
    "Machining / Job Works" // Sixth slide - metal-machining-services image
];

const SLIDE_DURATION = 7000; // 7 seconds per slide
let currentSlide = 0;
let letterIndex = 0;
let isDeleting = false;
let typingTimeout;
let slideInterval;

// Fix the initial state: ensure ONLY the first slide is active
slides.forEach((slide, index) => {
    if (index === 0) {
        slide.classList.add('active');
    } else {
        slide.classList.remove('active');
    }
});

// Dynamically create navigation dots
slides.forEach((_, index) => {
    const navButton = document.createElement('button');
    if (index === 0) navButton.classList.add('active');
    navButton.addEventListener('click', () => {
        showSlide(index);
        resetSlideTimer();
    });
    navContainer.appendChild(navButton);
});

const navButtons = document.querySelectorAll('.carousel-nav button');

function showSlide(n) {
    // Remove active class from current slide and nav button
    slides[currentSlide].classList.remove('active');
    navButtons[currentSlide].classList.remove('active');
    
    // Calculate new slide index with wrap-around
    currentSlide = (n + slides.length) % slides.length;
    
    // Add active class to new slide and nav button
    slides[currentSlide].classList.add('active');
    navButtons[currentSlide].classList.add('active');
    
    // Reset typing animation to start with new text
    resetTypingAnimation();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
    resetSlideTimer();
}

function resetSlideTimer() {
    // Clear existing interval and set a new one
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function resetTypingAnimation() {
    // Clear any existing animation timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Reset animation state
    letterIndex = 0;
    isDeleting = false;
    typingTextElement.textContent = '';
    
    // Calculate timing for the typing animation
    const currentWord = slideTexts[currentSlide];
    const totalChars = currentWord.length * 2; // Characters to type and delete
    
    // Calculate the time for one character (typing + deleting)
    // Reserve 1000ms for pause at full text, and 500ms for pause before retyping
    const timePerChar = (SLIDE_DURATION - 1500) / totalChars;
    
    // Start typing the text for the current slide
    typeText(timePerChar);
}

function typeText(timePerChar) {
    const currentWord = slideTexts[currentSlide];
    
    if (isDeleting) {
        letterIndex--;
        typingTextElement.textContent = currentWord.slice(0, letterIndex);
    } else {
        letterIndex++;
        typingTextElement.textContent = currentWord.slice(0, letterIndex);
    }

    let typingSpeed = timePerChar;

    if (!isDeleting && letterIndex === currentWord.length) {
        // Pause at the end of typing before starting to delete
        typingSpeed = 1000; // 1 second pause at full text
        isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
        // When deletion is complete, start typing the same word again
        isDeleting = false;
        typingSpeed = 500; // 0.5 second pause before retyping
    }

    typingTimeout = setTimeout(() => typeText(timePerChar), typingSpeed);
}

// Initialize typing animation for the first slide
resetTypingAnimation();

// Start the automatic slide transition
slideInterval = setInterval(nextSlide, SLIDE_DURATION);

// Event listeners for navigation buttons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);