/* LITTLE LOOP STUDIO — JavaScript (Week 2) */

// 1. Select HTML elements
const productLinks = document.querySelectorAll("[data-product]");
const productSelect = document.getElementById("product");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");


// 2. Pre-select a product when an enquiry link or button is clicked
productLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (!productSelect) return;
        productSelect.value = link.dataset.product;

        if (!productSelect.value) {
            productSelect.value = "Something else";
        }
    });
});


// 3. Mobile hamburger menu
function setMenu(open) {
    navMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
}

if (menuToggle && navMenu) {
    // Open / close with the ☰ button
    menuToggle.addEventListener("click", function () {
        setMenu(!navMenu.classList.contains("open"));
    });

    // Close when a menu link is tapped
    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenu(false);
        });
    });

    // Close with the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setMenu(false);
    });

    // Close when tapping outside the menu
    document.addEventListener("click", function (event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            setMenu(false);
        }
    });

    // Reset when the screen becomes wide (desktop)
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) setMenu(false);
    });
}


// 4. Contact form validation (inline errors for each field)
if (contactForm && formMessage) {
    const fields = {
        name: {
            input: document.getElementById("name"),
            error: document.getElementById("nameError"),
            check: function (value) {
                if (!value) return "Please enter your name.";
                if (value.length < 2) return "Your name must be at least 2 characters.";
                return "";
            }
        },
        email: {
            input: document.getElementById("email"),
            error: document.getElementById("emailError"),
            check: function (value) {
                if (!value) return "Please enter your email address.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Enter a valid email, like name@example.com.";
                }
                return "";
            }
        },
        product: {
            input: document.getElementById("product"),
            error: document.getElementById("productError"),
            check: function (value) {
                return value ? "" : "Please choose what you are interested in.";
            }
        },
        message: {
            input: document.getElementById("message"),
            error: document.getElementById("messageError"),
            check: function (value) {
                if (!value) return "Please write a short message.";
                if (value.length < 10) return "Your message must be at least 10 characters.";
                return "";
            }
        }
    };

    function showFieldError(field, message) {
        field.error.textContent = message;
        field.input.classList.toggle("invalid", message !== "");
        field.input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
    }

    function validateField(key) {
        const field = fields[key];
        const message = field.check(field.input.value.trim());
        showFieldError(field, message);
        return message === "";
    }

    function setFormMessage(type, text) {
        formMessage.textContent = text;
        formMessage.className = type;   // "success" or "error" (styled in CSS)
    }

    // Check a field when the user leaves it, and clear the error as they fix it
    Object.keys(fields).forEach(function (key) {
        const input = fields[key].input;
        input.addEventListener("blur", function () {
            validateField(key);
        });
        input.addEventListener("input", function () {
            if (input.classList.contains("invalid")) validateField(key);
        });
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let firstInvalid = null;

        Object.keys(fields).forEach(function (key) {
            const ok = validateField(key);
            if (!ok && !firstInvalid) firstInvalid = fields[key].input;
        });

        if (firstInvalid) {
            setFormMessage("error", "Please fix the highlighted fields and try again.");
            firstInvalid.focus();
            return;
        }

        const customerName = fields.name.input.value.trim();
        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalText = submitButton.textContent;

        // Short "sending" state so the user sees the button respond
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";

        setTimeout(function () {
            setFormMessage(
                "success",
                "Thank you, " + customerName + "! Your enquiry was sent. We'll reply soon ♡"
            );
            contactForm.reset();
            Object.keys(fields).forEach(function (key) {
                showFieldError(fields[key], "");
            });
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 700);
    });
}


// 5. Image carousel
const carouselTrack = document.getElementById("carouselTrack");

if (carouselTrack) {
    const slides = carouselTrack.children;
    const slideCount = slides.length;
    const prevButton = document.getElementById("carouselPrev");
    const nextButton = document.getElementById("carouselNext");
    const dotsBox = document.getElementById("carouselDots");
    const carousel = carouselTrack.closest(".carousel");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let current = 0;
    let timer = null;

    // Create one dot per slide
    const dots = [];
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
            goTo(i);
            restartAutoplay();
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
    }

    function goTo(index) {
        current = (index + slideCount) % slideCount;   // wraps around
        carouselTrack.style.transform = "translateX(-" + current * 100 + "%)";

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
            dot.setAttribute("aria-current", i === current ? "true" : "false");
        });
    }

    function startAutoplay() {
        if (reduceMotion || timer) return;
        timer = setInterval(function () {
            goTo(current + 1);
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(timer);
        timer = null;
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevButton.addEventListener("click", function () {
        goTo(current - 1);
        restartAutoplay();
    });

    nextButton.addEventListener("click", function () {
        goTo(current + 1);
        restartAutoplay();
    });

    // Pause while the user hovers or focuses inside the carousel
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    // Swipe on touch screens
    let touchStartX = 0;
    carouselTrack.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].clientX;
        stopAutoplay();
    }, { passive: true });

    carouselTrack.addEventListener("touchend", function (event) {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 40) {
            goTo(distance < 0 ? current + 1 : current - 1);
        }
        startAutoplay();
    }, { passive: true });

    goTo(0);
    startAutoplay();
}


// 6. Back-to-top button (created here, so no HTML needed)
const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});



