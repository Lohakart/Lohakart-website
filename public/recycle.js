
document.addEventListener('DOMContentLoaded', () => {
    // Animate stats counter function
    function animateStats() {
        const statElements = document.querySelectorAll('.stat-card .number');
        
        statElements.forEach(stat => {
            const originalText = stat.textContent;
            let startValue = 0;
            
            // If it's a percentage
            if (originalText.includes('%')) {
                const value = parseFloat(originalText);
                const increment = value / 50; // Faster animation
                
                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= value) {
                        clearInterval(timer);
                        startValue = value;
                    }
                    stat.textContent = Math.round(startValue) + '%';
                }, 20);
            } 
            // If it's a number with plus sign (like 15,000+)
            else if (originalText.includes('+')) {
                const numValue = parseInt(originalText.replace(/,|\+/g, ''));
                const increment = numValue / 50; // Faster animation
                
                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= numValue) {
                        clearInterval(timer);
                        startValue = numValue;
                    }
                    stat.textContent = Math.round(startValue).toLocaleString() + '+';
                }, 20);
            }
            // Regular number
            else {
                const value = parseFloat(originalText);
                const increment = value / 50; // Faster animation
                
                const timer = setInterval(() => {
                    startValue += increment;
                    if (startValue >= value) {
                        clearInterval(timer);
                        startValue = value;
                    }
                    stat.textContent = Math.round(startValue);
                }, 20);
            }
        });
    }

    // Create intersection observers for the animations
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    // Process section animation
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.process-step');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }, index * 150);
                });
                processObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Materials section animation
    const materialsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.material-card');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }, index * 150);
                });
                materialsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Benefits section animation
    const benefitsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.benefit-card');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }, index * 100);
                });
                benefitsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Stats section animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const processSection = document.querySelector('.process-steps');
    if (processSection) processObserver.observe(processSection);
    
    const materialsSection = document.querySelector('.materials-grid');
    if (materialsSection) materialsObserver.observe(materialsSection);
    
    const benefitsSection = document.querySelector('.benefits-grid');
    if (benefitsSection) benefitsObserver.observe(benefitsSection);
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
});
