/* ============================================
   MARIUS AC — script.js
   Dynamic Animations, Intersection Observers & Interactive Features
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

    // 1. DISPARIȚIE ECRAN DE ÎNCĂRCARE (LOADER)
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.classList.add("hidden");
        }
    });
    // Fallback în cazul în care evenimentul de load s-a declanșat deja
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if (loader && !loader.classList.contains("hidden")) {
            loader.classList.add("hidden");
        }
    }, 1500);

    // 2. EFECT SCHIMBARE NAVBAR LA SCROLL
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. MENIU MOBIL HAMBURGER (DESCHIDERE / ÎNCHIDERE)
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open");
            navLinks.classList.toggle("open");
        });

        // Închide meniul la click pe orice link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("open");
                navLinks.classList.remove("open");
            });
        });
    }

    // 4. ANIMAȚII LA SCROLL (REVEAL PE ELEMENTE)
    const revealElements = document.querySelectorAll(".reveal, .reveal-right");
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Oprește urmărirea după ce s-a animat o dată
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. ANIMAȚIE DE CREȘTERE CIFRE (STATISTICI)
    const statNumbers = document.querySelectorAll(".stat-num");

    const countUp = (targetElement) => {
        const countTo = parseInt(targetElement.getAttribute("data-count"), 10);
        const duration = 2000; // Durata animației în milisecunde (2 secunde)
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Funcție de Easing: easeOutQuad pentru încetinire fină pe final
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * countTo);

            targetElement.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                targetElement.textContent = countTo;
            }
        };

        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => {
        statsObserver.observe(num);
    });

    // 6. COMUTATOR DE LIMBĂ INTELIGENT (RO / EN)
    const langToggles = document.querySelectorAll("#langToggle, #langToggleMobile");
    let currentLang = "ro";

    const changeLanguage = () => {
        currentLang = currentLang === "ro" ? "en" : "ro";

        document.documentElement.setAttribute("data-lang", currentLang);

        langToggles.forEach(toggle => {
            toggle.textContent = currentLang === "ro" ? "EN" : "RO";
        });

        const elements = document.querySelectorAll("[data-ro], [data-en]");
        elements.forEach(el => {
            const translation = el.getAttribute(`data-${currentLang}`);
            if (translation) {
                if (translation.includes("<br>") || el.innerHTML.includes("<br>")) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    };

    langToggles.forEach(toggle => {
        toggle.addEventListener("click", changeLanguage);
    });

    // 7. EFECT DISCRET DE FUNDAL CU FULGI DE NEA (CANVAS LAYER)
    const canvas = document.getElementById("snowCanvas");
    if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const maxFlakes = 40;
        const flakes = [];

        for (let i = 0; i < maxFlakes; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                density: Math.random() * maxFlakes,
                speed: Math.random() * 0.8 + 0.3
            });
        }

        const drawSnow = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(126, 200, 227, 0.4)";
            ctx.beginPath();

            for (let i = 0; i < maxFlakes; i++) {
                const f = flakes[i];
                ctx.moveTo(f.x, f.y);
                ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);

                f.y += f.speed;
                f.x += Math.sin(f.density) * 0.4;

                if (f.y > height) {
                    flakes[i] = {
                        x: Math.random() * width,
                        y: -10,
                        radius: f.radius,
                        density: f.density,
                        speed: f.speed
                    };
                }
            }
            ctx.fill();
            requestAnimationFrame(drawSnow);
        };

        drawSnow();
    }
});