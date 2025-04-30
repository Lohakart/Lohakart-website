
        document.addEventListener('DOMContentLoaded', function() {
            // Get all the steps and form steps
            const steps = document.querySelectorAll('.step');
            const formSteps = document.querySelectorAll('.form-step');
            const progress = document.getElementById('progress');
            
            // Navigation buttons
            const btnToStep2 = document.getElementById('btn-to-step-2');
            const btnToStep1 = document.getElementById('btn-to-step-1');
            const btnToStep3 = document.getElementById('btn-to-step-3');
            const sendToWhatsApp = document.getElementById('sendToWhatsApp');
            const newInquiry = document.getElementById('new-inquiry');
            
            // Show address field when pickup is selected
            const pickup = document.getElementById('pickup');
            const addressGroup = document.getElementById('address-group');
            
            // Progress bar update function
            function updateProgress(currentStep) {
                let width = 0;
                
                if (currentStep === 1) {
                    width = 0;
                } else if (currentStep === 2) {
                    width = 50;
                } else if (currentStep === 3) {
                    width = 100;
                }
                
                progress.style.width = width + '%';
            }
            
            // Navigate to specific step
            function goToStep(stepNumber) {
                // Update step indicators
                steps.forEach((step, index) => {
                    if (index < stepNumber) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
                
                // Update form display
                formSteps.forEach((formStep, index) => {
                    if (index === stepNumber - 1) {
                        formStep.classList.add('active');
                    } else {
                        formStep.classList.remove('active');
                    }
                });
                
                // Update progress bar
                updateProgress(stepNumber);
            }
            
            // Validate form fields
            function validateStep(stepNumber) {
                if (stepNumber === 1) {
                    const name = document.getElementById('name').value;
                    const mobile = document.getElementById('mobile').value;
                    const email = document.getElementById('email').value;
                    
                    if (!name || !mobile || !email) {
                        alert('Please fill all required fields');
                        return false;
                    }
                    
                    // Simple email validation
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(email)) {
                        alert('Please enter a valid email address');
                        return false;
                    }
                    
                    return true;
                }
                
                else if (stepNumber === 2) {
                    const material = document.getElementById('material').value;
                    const quantity = document.getElementById('quantity').value;
                    const condition = document.getElementById('condition').value;
                    
                    if (!material || !quantity || !condition) {
                        alert('Please fill all required fields');
                        return false;
                    }
                    
                    return true;
                }
                
                return true;
            }
            
            // Button event listeners for navigation
            btnToStep2.addEventListener('click', function() {
                if (validateStep(1)) {
                    goToStep(2);
                }
            });
            
            btnToStep1.addEventListener('click', function() {
                goToStep(1);
            });
            
            btnToStep3.addEventListener('click', function() {
                if (validateStep(2)) {
                    goToStep(3);
                }
            });
            
            // Show/hide address field based on pickup selection
            pickup.addEventListener('change', function() {
                if (this.value === 'yes') {
                    addressGroup.style.display = 'block';
                    document.getElementById('address').setAttribute('required', 'required');
                } else {
                    addressGroup.style.display = 'none';
                    document.getElementById('address').removeAttribute('required');
                }
            });
            
            // WhatsApp form submission
            sendToWhatsApp.addEventListener('click', function() {
                const name = document.getElementById('name').value;
                const mobile = document.getElementById('mobile').value;
                const email = document.getElementById('email').value;
                const material = document.getElementById('material').value;
                const quantity = document.getElementById('quantity').value;
                const condition = document.getElementById('condition').value;
                const pickupRequired = document.getElementById('pickup').value;
                const address = document.getElementById('address').value;
                const message = document.getElementById('message').value;
                
                if (!name || !mobile || !email || !material || !quantity || !condition || !pickupRequired || !message) {
                    alert('Please fill all required fields');
                    return;
                }
                
                // If pickup is required, address is mandatory
                if (pickupRequired === 'yes' && !address) {
                    alert('Please provide your pickup address');
                    return;
                }
                
                // Show loading animation
                document.getElementById('form-step-3').style.display = 'none';
                document.getElementById('loading').style.display = 'block';
                
                // Construct WhatsApp message
                let whatsappMessage = `*Recycling Inquiry from Lohakart Website*%0A%0A`;
                whatsappMessage += `*Name:* ${name}%0A`;
                whatsappMessage += `*Mobile:* ${mobile}%0A`;
                whatsappMessage += `*Email:* ${email}%0A%0A`;
                whatsappMessage += `*Material Type:* ${material}%0A`;
                whatsappMessage += `*Quantity:* ${quantity} kg%0A`;
                whatsappMessage += `*Condition:* ${condition}%0A`;
                whatsappMessage += `*Pickup Required:* ${pickupRequired}%0A`;
                
                if (pickupRequired === 'yes') {
                    whatsappMessage += `*Pickup Address:* ${address}%0A%0A`;
                }
                
                whatsappMessage += `*Additional Details:* ${message}`;
                
                // Simulate form submission (normally would send to server)
                setTimeout(function() {
                    // Hide loading and show success message
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('success-message').style.display = 'block';
                    
                    // Open WhatsApp with the message
                    window.open(`https://wa.me/919580002078?text=${whatsappMessage}`, '_blank');
                }, 1500);
            });
            
            // New inquiry button
            newInquiry.addEventListener('click', function() {
                // Reset the form
                document.getElementById('recyclingForm').reset();
                document.getElementById('success-message').style.display = 'none';
                document.getElementById('address-group').style.display = 'none';
                goToStep(1);
            });
        });
    