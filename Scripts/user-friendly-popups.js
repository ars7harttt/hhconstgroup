// User-Friendly Pop-ups and Slides

(function() {
  'use strict';

  // Welcome Pop-up (shows once)
  function initWelcomePopup() {
    const hasSeenWelcome = localStorage.getItem('hhconstgroup_welcome_seen');
    if (hasSeenWelcome === 'true') return;

    const welcomePopup = document.createElement('div');
    welcomePopup.className = 'welcome-popup';
    welcomePopup.innerHTML = `
      <div class="welcome-popup-content">
        <button class="welcome-popup-close" aria-label="Close welcome message">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="welcome-popup-icon">👷🏻‍♂️</div>
        <h3>Welcome to HH Construction Group Inc.</h3>
        <p>We're here to help with all your construction needs. Explore our services, get a free estimate, or learn more about what we offer!</p>
        <div class="welcome-popup-actions">
          <button class="btn btn-primary welcome-popup-btn" onclick="window.location.href='./contuctUs.html'">
            <i class="fa-solid fa-calculator"></i> Get Free Estimate
          </button>
          <button class="btn btn-outline welcome-popup-btn" onclick="window.location.href='./aboutPage.html'">
            <i class="fa-solid fa-info-circle"></i> Learn More About Us
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(welcomePopup);

    const closeBtn = welcomePopup.querySelector('.welcome-popup-close');
    const buttons = welcomePopup.querySelectorAll('.welcome-popup-btn');

    function closeWelcome() {
      welcomePopup.classList.add('closing');
      setTimeout(() => {
        welcomePopup.remove();
        localStorage.setItem('hhconstgroup_welcome_seen', 'true');
      }, 300);
    }

    closeBtn.addEventListener('click', closeWelcome);
    welcomePopup.addEventListener('click', (e) => {
      if (e.target === welcomePopup) closeWelcome();
    });

    // Show after a short delay
    setTimeout(() => {
      welcomePopup.classList.add('show');
    }, 1000);
  }

  // Slide-in Notification System
  function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `slide-notification ${type}`;
    notification.innerHTML = `
      <div class="slide-notification-content">
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="slide-notification-close" aria-label="Close notification">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    const closeBtn = notification.querySelector('.slide-notification-close');
    function closeNotification() {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }

    closeBtn.addEventListener('click', closeNotification);

    if (duration > 0) {
      setTimeout(closeNotification, duration);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initWelcomePopup();
    });
  } else {
    initWelcomePopup();
  }

  // Export notification function globally
  window.showNotification = showNotification;
})();
