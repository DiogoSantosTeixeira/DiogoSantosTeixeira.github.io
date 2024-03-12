const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

const hiddenEl = document.querySelectorAll(".hidden");



hiddenEl.forEach((el) => observer.observe(el));