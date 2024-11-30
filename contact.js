
// contact us form :--------

        (function() {
    // Initialize EmailJS with your user ID
    emailjs.init("sj3tQI5Mfod-RFkvV");
})();



document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Send email using EmailJS
    emailjs.send("service_stvggpu", "template_ysbxo29", {
        from_name: name,
        from_email: email,
        phone: phone,
        subject: subject,
        message: message
    }).then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert('Your message has been sent successfully!');
        document.getElementById('contactForm').reset();
    }, function(error) {
        console.log('FAILED...', error);
        alert('Failed to send the message. Please try again later.');
    });
});
