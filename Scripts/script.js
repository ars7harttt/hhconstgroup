

// Header scroll behavior - show on scroll up, hide on scroll down
let lastScrollTop = 0;
let scrollThreshold = 100; // Minimum scroll distance before hiding header
const header = document.querySelector('.site-header');

if (header) {
  let ticking = false;
  
  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Always show header at the top of the page
    if (scrollTop < 50) {
      header.classList.remove('hidden');
      lastScrollTop = scrollTop;
      ticking = false;
      return;
    }
    
    // Show header when scrolling up
    if (scrollTop < lastScrollTop && scrollTop > scrollThreshold) {
      header.classList.remove('hidden');
    }
    // Hide header when scrolling down past threshold
    else if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      header.classList.add('hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

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

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  // Check if original text has a "+" or "%" sign
  const originalText = element.textContent;
  const hasPlus = originalText.includes('+');
  const hasPercent = originalText.includes('%');
  
  // Set initial value to 0
  element.textContent = '0' + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
    }
  }, 16);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('is-visible')) {
      const statNumber = entry.target.querySelector('.stat-number');
      if (statNumber) {
        const target = parseInt(statNumber.getAttribute('data-target'));
        if (target && !statNumber.classList.contains('animated')) {
          statNumber.classList.add('animated');
          animateCounter(statNumber, target);
        }
      }
    }
  });
}, { threshold: 0.5 });

// Observe all stat items
document.querySelectorAll('.stat-item').forEach(item => {
  statsObserver.observe(item);
});


const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');