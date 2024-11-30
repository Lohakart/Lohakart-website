// slide show

const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const navContainer = document.querySelector('.carousel-nav');

let currentSlide = 0;

// Dynamically create navigation dots
slides.forEach((_, index) => {
const navButton = document.createElement('button');
if (index === 0) navButton.classList.add('active');
navButton.addEventListener('click', () => showSlide(index));
navContainer.appendChild(navButton);
});

const navButtons = document.querySelectorAll('.carousel-nav button');

function showSlide(n) {
slides[currentSlide].classList.remove('active');
navButtons[currentSlide].classList.remove('active');
currentSlide = (n + slides.length) % slides.length;
slides[currentSlide].classList.add('active');
navButtons[currentSlide].classList.add('active');
}

function nextSlide() {
showSlide(currentSlide + 1);
}

function prevSlide() {
showSlide(currentSlide - 1);
}

// Automatically move to the next slide every 7 seconds
setInterval(nextSlide, 7000);

// Event listeners for navigation buttons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Typing Effect for the Last Word
const typingTextElement = document.getElementById('typing-text');
const words = ["Metal Fabrication", "Metal Procurement", "Metal Recycling", "Metal Casting / Forging", "Metal Machining / Job Works"];
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function type() {
const currentWord = words[wordIndex];
if (isDeleting) {
    letterIndex--;
    typingTextElement.textContent = currentWord.slice(0, letterIndex);
} else {
    letterIndex++;
    typingTextElement.textContent = currentWord.slice(0, letterIndex);
}

if (!isDeleting && letterIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(type, 1000); // Pause before deleting
} else if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 500); // Pause before typing next word
} else {
    setTimeout(type, isDeleting ? 100 : 200);
}
}

type();


// ----------
