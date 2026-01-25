// Modern TikTok-style Animations

(function() {
  'use strict';

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate all h1 and adjacent p tags
  function initHeadingAnimations() {
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading, index) => {
      heading.style.opacity = '0';
      heading.style.transform = 'translateY(30px)';
      heading.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
      observer.observe(heading);
    });

    // Animate paragraphs that follow headings
    headings.forEach(heading => {
      const nextP = heading.nextElementSibling;
      if (nextP && nextP.tagName === 'P') {
        nextP.style.opacity = '0';
        nextP.style.transform = 'translateY(20px)';
        nextP.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s';
        observer.observe(nextP);
      }
    });
  }

  // Animate service cards with stagger
  function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.9)';
      card.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`;
      observer.observe(card);
    });
  }

  // Animate feature list items
  function initFeatureAnimations() {
    const features = document.querySelectorAll('.feature-list li');
    features.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
      observer.observe(item);
    });
  }

  // Animate stats
  function initStatsAnimations() {
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(20px)';
      stat.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
      observer.observe(stat);
    });
  }

  // Smooth parallax effect on scroll
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.section-title, .section-subtitle');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const speed = 0.1;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    });
  }

  // Card hover animations
  function initCardHover() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Button animations
  function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
        this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Animate hero section buttons
  function initHeroAnimations() {
    const hero = document.querySelector('.hero, .page-hero');
    if (!hero) return;
    
    const heroButtons = hero.querySelector('.hero-buttons')?.querySelectorAll('.btn') || hero.querySelectorAll('.btn');
    
    // Animate buttons with stagger
    heroButtons.forEach((btn, index) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(30px) scale(0.9)';
      btn.style.transition = `all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.8 + index * 0.2}s`;
      setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0) scale(1)';
      }, 800 + index * 200);
    });
  }

  // Animate about page sections
  function initAboutAnimations() {
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      const paragraphs = aboutText.querySelectorAll('p, h2, h3');
      paragraphs.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
        observer.observe(el);
      });
    }

    const infoBoxes = document.querySelectorAll('.info-box');
    infoBoxes.forEach((box, index) => {
      box.style.opacity = '0';
      box.style.transform = 'translateX(30px) scale(0.95)';
      box.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`;
      observer.observe(box);
    });

    const aboutList = document.querySelectorAll('.about-text .feature-list li, .info-box ul li');
    aboutList.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
      observer.observe(item);
    });
  }

  // Initialize all animations
  function init() {
    initHeadingAnimations();
    initHeroAnimations();
    initCardAnimations();
    initFeatureAnimations();
    initStatsAnimations();
    initAboutAnimations();
    initParallax();
    initCardHover();
    initButtonAnimations();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
