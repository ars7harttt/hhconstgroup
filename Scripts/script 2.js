
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}


document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 720) {
      nav.classList.remove('open');
    }
  });
});


const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');