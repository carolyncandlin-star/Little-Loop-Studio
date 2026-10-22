/* LITTLE LOOP STUDIO — JavaScript */

// 1. Select HTML elements
const productLinks = document.querySelectorAll("[data-product]");
const productSelect = document.getElementById("product");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

  
// 2. Select a product when an enquiry link is clicked
productLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        productSelect.value = link.dataset.product;

        if (!productSelect.value) {
            productSelect.value = "Something else";
        }
    });
});

// 3. Handle contact form submission (with validation)
if (contactForm && formMessage) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const interest = productSelect.value;
        const message = document.getElementById("message").value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!customerName || !email || !interest || !message) {
            formMessage.textContent = "Please fill in all the fields.";
            formMessage.style.color = "#b3453f";
            return;
        }

        if (!emailOk) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "#b3453f";
            return;
        }

        formMessage.textContent =
            "Thank you, " + customerName + "! We'll get back to you soon ♡";
        formMessage.style.color = "#3d8b4f";

        contactForm.reset();
    });
}


// 4. Mobile hamburger menu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);

       
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}