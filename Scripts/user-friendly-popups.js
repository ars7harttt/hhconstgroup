// User-Friendly Pop-ups and Slides

(function() {
  'use strict';

  // Remove any existing welcome popups (in case of cached code)
  function removeWelcomePopups() {
    const welcomePopups = document.querySelectorAll('.welcome-popup');
    welcomePopups.forEach(popup => popup.remove());
  }

  // Remove immediately and on DOM ready
  removeWelcomePopups();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeWelcomePopups);
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

  // Export notification function globally
  window.showNotification = showNotification;
})();
