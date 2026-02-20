document.addEventListener('DOMContentLoaded', () => {
    // --- Protection Section ---
    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable keyboard shortcuts for DevTools and Source view
    document.onkeydown = function (e) {
        if (e.keyCode == 123) { // F12
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { // Ctrl+Shift+I
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { // Ctrl+Shift+C
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { // Ctrl+Shift+J
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { // Ctrl+U (View Source)
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) { // Ctrl+S (Save Page)
            return false;
        }
    };

    // Domain Lock - Замініть 'yourdomain.com' на свій домен
    const allowedDomains = ['localhost', '127.0.0.1'];
    const currentDomain = window.location.hostname;

    // Якщо хочете активувати блокування на інших доменах - розкоментуйте код нижче
    /* 
    if (currentDomain !== "" && !allowedDomains.includes(currentDomain)) {
        document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;'><h1>Unauthorized Copy detected. Content protected.</h1></div>";
        setTimeout(() => { window.location.href = "https://google.com"; }, 2000);
    }
    */
    // ---------------------------

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 40px';
            header.style.background = 'rgba(5, 7, 10, 0.95)';
        } else {
            header.style.padding = '20px 40px';
            header.style.background = 'rgba(5, 7, 10, 0.8)';
        }
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .req-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Player count simulation
    const playerCountEl = document.getElementById('online-players');
    if (playerCountEl) {
        let count = parseInt(playerCountEl.innerText);
        setInterval(() => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            count = Math.max(100, Math.min(999, count + change));
            playerCountEl.innerText = count;
        }, 5000);
    }
});
