
const categories = [
    "All",
    "Mild Steel",
    "Galvanised Coil",
    "Stainless Steel",
    "Copper",
    "Zinc",
    "Aluminum"
];

const products = [
{ name: "TMT BARS", image: "products/tmt-bars-thermo-mechanically-treated-bars-lohakart.webp", alt: "High-quality TMT bars (Thermo-Mechanically Treated Bars) for construction and infrastructure applications, sourced and supplied by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel"},
{ name: "PLATES", image: "products/metal-plates-sourcing-supply-lohakart.webp", alt: "Durable metal plates for manufacturing, construction, and industrial applications, provided by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "HR SHEETS", image: "products/hr-sheets-hot-rolled-sheets-lohakart.webp", alt: "Premium HR sheets (Hot Rolled Sheets) for construction and manufacturing industries, available at LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "CR SHEETS", image: "products/cr-sheets-cold-rolled-sheets-lohakart.webp", alt: "High-quality CR sheets (Cold Rolled Sheets) for precision manufacturing, offered by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "CHANNEL ISMC", image: "products/channel-ismc-indian-standard-medium-channel-lohakart.webp", alt: "Reliable Channel ISMC (Indian Standard Medium Channel) metal products for structural applications, sourced from LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "BEAMS | JOIST", image: "products/metal-beams-joist-structural-metal-lohakart.webp", alt: "Strong metal beams and joists for construction and infrastructure projects, available at LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "ANGLES ISA", image: "products/angles-isa-indian-standard-angles-lohakart.webp", alt: "High-quality Angles ISA (Indian Standard Angles) for structural applications, provided by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "ROUND | SQUARE PIPE", image: "products/round-square-pipes-rhs-metal-piping-lohakart.webp", alt: "Versatile round and square pipes for plumbing, construction, and industrial use, sourced by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "ROUND BARS", image: "products/round-bars-metal-sourcing-lohakart.webp", alt: "Durable round bars for manufacturing, construction, and engineering, supplied by LohaKart.", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "MS CHEQURED PLATE", image: "products/ms-chequered-plate-mild-steel-lohakart.webp", alt: "Mild Steel Chequered Plates (MS Chequered Plate) for flooring and industrial applications, offered by LohaKart", quantity: 0, unit: "MT", category: "Mild Steel" },
{ name: "MS STEEL SCRAP", image: "products/ms-steel-scrap-mild-steel-lohakart.webp", alt: "High-quality MS Steel Scrap (Mild Steel Scrap) for recycling and industrial use, available at LohaKart", quantity: 0, unit: "MT", category: "Mild Steel" },

{ name: "GI SHEETS", image: "products/gi-sheets-galvanized-iron-sheets-lohakart.webp", alt: "Premium GI Sheets (Galvanized Iron Sheets) for roofing and industrial applications, sourced from LohaKart.", quantity: 0, unit: "MT", category: "Galvanised Coil" },

{ name: "SS SHEETS", image: "products/ss-sheets-stainless-steel-sheets-lohakart.webp", alt: "High-quality SS Sheets (Stainless Steel Sheets) for industrial and commercial uses, offered by LohaKart.", quantity: 0, unit: "MT", category: "Stainless Steel" },
{ name: "SS PIPE", image: "products/ss-pipes-stainless-steel-pipes-lohakart.webp", alt: "Durable SS Pipes (Stainless Steel Pipes) for plumbing, construction, and industrial applications, available from LohaKart.", quantity: 0, unit: "MT", category: "Stainless Steel" },
{ name: "SS ROD", image: "products/ss-rod-stainless-steel-rod-lohakart.webp", alt: "Premium SS Rods (Stainless Steel Rods) for manufacturing and construction, provided by LohaKart.", quantity: 0, unit: "MT", category: "Stainless Steel" },

{ name: "COPPER WIRE", image: "products/copper-wire-metal-sourcing-lohakart.webp", alt: "High-quality copper wire for electrical and industrial applications, sourced by LohaKart.", quantity: 0, unit: "MT", category: "Copper" },
{ name: "COPPER SHEET", image: "products/copper-sheet-metal-supply-lohakart.webp", alt: "Versatile copper sheets for industrial, electrical, and manufacturing uses, offered by LohaKart.", quantity: 0, unit: "MT", category: "Copper" },
{ name: "COPPER TUBE", image:"products/copper-tube-metal-pipe-lohakart.webp", alt: "Reliable copper tubes for plumbing, electrical, and industrial applications, available at LohaKart.", quantity: 0, unit: "MT", category: "Copper" },

{ name: "ZINC SHEET", image: "products/zinc-sheet-metal-supply-lohakart.webp", alt: "High-quality zinc sheets for industrial and construction purposes, sourced and supplied by LohaKart.", quantity: 0, unit: "MT", category: "Zinc" },
{ name: "ZINC INGOT", image: "products/zinc-ingot-metal-sourcing-lohakart.webp", alt: "Pure zinc ingots for metal manufacturing and industrial use, available from LohaKart.", quantity: 0, unit: "MT", category: "Zinc" },

{ name: "ALUMINUM SHEET", image:"products/aluminum-sheet-metal-sourcing-lohakart.webp", alt: "Premium aluminum sheets for manufacturing, construction, and industrial applications, provided by LohaKart.", quantity: 0, unit: "MT", category: "Aluminum" },
{ name: "ALUMINUM ROD", image: "products/aluminum-rod-metal-supply-lohakart.webp", alt: "Durable aluminum rods for industrial, manufacturing, and construction needs, sourced by LohaKart.", quantity: 0, unit: "MT", category: "Aluminum" },
{ name: "ALUMINUM PROFILE", image: "products/aluminum-profile-metal-sourcing-lohakart.webp", alt: "Versatile aluminum profiles for structural applications and manufacturing, available from LohaKart.", quantity: 0, unit: "MT", category: "Aluminum" }


];


const cart = [];
let currentStep = 1;
let currentCategory = "All";

function renderCategories() {
    const categorySection = document.getElementById('categorySection');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.onclick = () => filterProducts(category);
        if (category === currentCategory) {
            button.classList.add('active');
        }
        categorySection.appendChild(button);
    });
}

function filterProducts(category) {
    currentCategory = category;
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts();
}

function renderProducts() {
const grid = document.getElementById('productGrid');
grid.innerHTML = '';
products.forEach((product, index) => {
if (currentCategory === "All" || product.category === currentCategory) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Add product image
    const img = document.createElement('img');
    img.src = product.image; // Use the image path from the product object
    img.alt = product.name; // Alt text for accessibility
    img.classList.add('product-image'); // Add a class for styling
    
    card.innerHTML = `
        <p class="card-text2">${product.name}</p>
        <div class="quantity-control">
            <div class="quantity-control1">
                <input type="number" class="quantity-input" id="quantity-${index}" min="0" value="0">
                <select class="unit-select" id="unit-${index}">
                    <option value="MT">MT</option>
                    <option value="Kgs">Kgs</option>
                </select>
            </div>
            <button class="add-btn" onclick="addToCart(${index})">+</button>
        </div>
    `;

    // Insert the image at the beginning of the card
    card.insertBefore(img, card.firstChild);
    grid.appendChild(card);
}
});
}


function addToCart(index) {
const quantityInput = document.getElementById(`quantity-${index}`);
const unitSelect = document.getElementById(`unit-${index}`);
const quantity = parseFloat(quantityInput.value);
const unit = unitSelect.value;

if (quantity > 0) {
const product = products[index];
const existingItem = cart.find(item => item.name === product.name && item.unit === unit);
if (existingItem) {
    existingItem.quantity += quantity;
} else {
    cart.push({ 
        name: product.name, 
        quantity: quantity, 
        unit: unit, 
        category: product.category,
        image: product.image // Make sure to add the image property here
    });
}
quantityInput.value = 0;
updateCart();
}
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const nextBtn = document.getElementById('nextBtn');
    
    // Clear existing items in the cart display
    cartItems.innerHTML = '';
    
    // Loop through cart items and create the display
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} (${item.quantity} ${item.unit})</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
        `;
        cartItems.appendChild(div); // Append the item to the cart display
    });
    
    // Update the cart count display
    cartCount.textContent = cart.length;

    // Enable or disable the Next button based on cart contents
    nextBtn.disabled = cart.length === 0;
    nextBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
    nextBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
}

function removeFromCart(index) {
    // Remove the item at the specified index
    cart.splice(index, 1);
    // Update the cart display
    updateCart();
}

// Initialize event listeners once the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true; // Initially disable the Next button
    nextBtn.style.opacity = '0.5';
    nextBtn.style.cursor = 'not-allowed';

    nextBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showSelectedProducts(); // Function to show selected products
            currentStep = 2; // Move to the next step
            showForm(); // Function to display the form
        }
    });
});


// ---------------
function showSelectedProducts() {
const grid = document.getElementById('productGrid');
const categorySection = document.getElementById('categorySection');

// Clear the grid and hide the category section
grid.innerHTML = '';
categorySection.style.display = 'none'; // Hide the category section

// Loop through the cart to display selected products with images
cart.forEach(item => {
const card = document.createElement('div');
card.className = 'product-card';

// Create the image element
const img = document.createElement('img');
img.src = item.image; // Ensure the image path from the cart item is used
img.alt = item.name;  // Alt text for accessibility
img.classList.add('product-image'); // Add a class for styling

// Add the product details, including image and quantity
const productDetails = `
    <p class="card-text2">${item.name}</p>
    <p class="card-text2">Quantity: ${item.quantity} ${item.unit}</p>
`;

card.appendChild(img); // Append the image to the card
card.innerHTML += productDetails; // Append the product details after the image
grid.appendChild(card); // Append the card to the grid
});
}



function submitForm() {
    const company = document.getElementById('company').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Check if required fields are filled
    if (!company || !name || !email || !phone) {
        alert("Please fill out all required fields.");
        return;
    }

    const whatsappMessage = encodeURIComponent(`
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Message: ${message}

Selected Products:-
${cart.map(item => `${item.name} (${item.quantity} ${item.unit})`).join('\n')}
    `);

    const whatsappNumber = '919580002078'; // Replace with your WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappLink, '_blank');

    currentStep = 3;
    updateProgressBar();
    showPopup();
}

function showPopup() {
const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Thank You!</h2>
            <p>Your quotation request has been sent via WhatsApp. We'll get back to you soon.</p>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

// Add styles for the popup
const style = document.createElement('style');
style.textContent = `
.popup {
    padding-inline: 12px;    
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backgsround-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.popup-content {
    backgsround-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.popup-content h2 {
    margin-top: 0;
}
.popup-content button {
    backgsround-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}
`;
document.head.appendChild(style);
}

function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
    // Reload the page
    window.location.reload();
}


function updateProgressBar() {
const progress = document.getElementById('progressBar');
const steps = document.querySelectorAll('.step');
const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
progress.style.width = `${progressPercentage}%`;

steps.forEach((step, index) => {
if (index < currentStep) {
    step.classList.add('active');
} else {
    step.classList.remove('active');
}
});
}

function showForm() {
const rightPanel = document.getElementById('rightPanel');
rightPanel.innerHTML = `
<div class="form-container">
    <div class="step-indicator">
        <span class="step">Select Products</span>
        <span class="step active">Enter Details</span>
        <span class="step">Confirm</span>
    </div>
    <div class="progress-bar">
        <div class="progress" id="progressBar"></div>
    </div>
    <h3>Contact Details</h3>
    <input type="text" id="company" placeholder="Company Name" required>
    <input type="text" id="name" placeholder="Name" required>
    <input type="email" id="email" placeholder="Email" required>
    <input type="tel" id="phone" placeholder="Phone" required>
    <textarea id="message" placeholder="Additional Message"></textarea>
    <h3>Selected Products</h3>
    <ul id="selectedProducts"></ul>
    <button onclick="submitForm()">Submit</button>
</div>
`;
const selectedProducts = document.getElementById('selectedProducts');
cart.forEach(item => {
const li = document.createElement('li');
li.textContent = `${item.name} (${item.quantity} ${item.unit})`;
selectedProducts.appendChild(li);
});
updateProgressBar();
}

document.getElementById('nextBtn').addEventListener('click', () => {
    showSelectedProducts();
    currentStep = 2;
    showForm();

});


renderCategories();
renderProducts();


