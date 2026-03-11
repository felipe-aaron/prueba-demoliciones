document.addEventListener("DOMContentLoaded", function () {

    /* Año actual */
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* Menú hamburguesa */
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav   = document.querySelector(".main-nav");
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* Header sombra al hacer scroll */
    const header = document.querySelector(".site-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }, { passive: true });
    }

    /* Scroll-reveal para cards y elementos */
    const revealTargets = document.querySelectorAll(
        ".card, .process-list li, .faq-item, .highlight-item, .service-area"
    );
    revealTargets.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(22px)";
        el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    });
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = Array.from(entry.target.parentElement.children);
                const delay = siblings.indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => revealObserver.observe(el));

    /* Contador animado de stats */
    function animateCounter(el) {
        const raw    = el.textContent.trim();
        const isPlus = raw.startsWith("+");
        const isPct  = raw.endsWith("%");
        const num    = parseInt(raw.replace(/[^0-9]/g, ""), 10);
        if (isNaN(num) || num === 0) return;
        const duration = 1600;
        const start    = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = (isPlus ? "+" : "") + Math.round(eased * num) + (isPct ? "%" : "");
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const statNumbers = document.querySelectorAll(".highlight-item .number");
    let countersStarted = false;
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting) && !countersStarted) {
            countersStarted = true;
            statNumbers.forEach((el) => animateCounter(el));
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });
    statNumbers.forEach((el) => statsObserver.observe(el));

    /* Nav activo según sección visible */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".main-nav ul li a");
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.style.color = link.getAttribute("href") === "#" + entry.target.id
                        ? "var(--accent)" : "";
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach((sec) => sectionObserver.observe(sec));

    /* FAQ accordion */
    document.querySelectorAll(".faq-item").forEach((item, index) => {
        const question = item.querySelector("h3");
        const answer   = item.querySelector("div");
        if (index !== 0) answer.style.display = "none";
        question.addEventListener("click", () => {
            const isOpen = answer.style.display !== "none";
            item.closest(".faq-list").querySelectorAll(".faq-item div").forEach((a) => { a.style.display = "none"; });
            item.closest(".faq-list").querySelectorAll(".faq-item h3").forEach((q) => { q.classList.remove("faq-open"); });
            if (!isOpen) { answer.style.display = "block"; question.classList.add("faq-open"); }
        });
    });
});
