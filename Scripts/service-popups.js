// Service Cards Pop-ups and Interactive Slides

(function() {
  'use strict';

  // Service data
  const serviceData = {
    residential: {
      title: 'Residential Construction',
      description: 'Custom homes, ADUs and additions with careful planning, clear communication and high-quality finishes.',
      image: 'residential',
      features: [
        'Custom home building from ground up',
        'ADU (Accessory Dwelling Unit) construction',
        'Home additions and expansions',
        'High-end finishes and modern design',
        'Full project management and coordination',
        'Licensed and insured construction team'
      ]
    },
    commercial: {
      title: 'Commercial Projects',
      description: 'Offices, retail and tenant improvements designed to look sharp and function perfectly.',
      image: 'commercial',
      features: [
        'Office space build-outs and renovations',
        'Retail store construction and improvements',
        'Tenant improvements and fit-outs',
        'Restaurant and hospitality projects',
        'Warehouse and industrial facilities',
        'Commercial remodeling and upgrades'
      ]
    },
    remodeling: {
      title: 'Remodels & Renovations',
      description: 'Kitchens, bathrooms, exteriors and full remodels that bring old spaces to a new level.',
      image: 'remodeling',
      features: [
        'Complete kitchen remodels',
        'Bathroom renovations and upgrades',
        'Exterior improvements and siding',
        'Full home remodels',
        'Interior design coordination',
        'Energy-efficient upgrades'
      ]
    }
  };

  // Initialize service modal
  function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    const overlay = modal.querySelector('.service-modal-overlay');
    const closeBtn = modal.querySelector('.service-modal-close');
    const serviceCards = document.querySelectorAll('.service-card');

    function openModal(serviceKey) {
      const service = serviceData[serviceKey];
      if (!service) return;

      // Set modal content
      document.getElementById('serviceModalTitle').textContent = service.title;
      document.getElementById('serviceModalDescription').textContent = service.description;
      
      // Set image
      const imageContainer = document.getElementById('serviceModalImage');
      imageContainer.style.backgroundImage = `url(./Images/${service.image}.png)`;
      
      // Set features
      const featuresContainer = document.getElementById('serviceModalFeatures');
      featuresContainer.innerHTML = '<h3>What We Offer:</h3><ul class="service-features-list">' +
        service.features.map(feature => `<li><i class="fa-solid fa-check"></i> ${feature}</li>`).join('') +
        '</ul>';

      // Show modal
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }

    // Add click handlers to cards
    serviceCards.forEach(card => {
      card.style.cursor = 'pointer';
      const serviceKey = card.getAttribute('data-service');
      
      card.addEventListener('click', (e) => {
        // Don't open if clicking the learn more button (it will handle it)
        if (!e.target.classList.contains('card-learn-more')) {
          openModal(serviceKey);
        }
      });
    });

    // Learn more buttons
    document.querySelectorAll('.card-learn-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.service-card');
        const serviceKey = card.getAttribute('data-service');
        openModal(serviceKey);
      });
    });

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });
  }

  // Feature list item pop-ups
  function initFeaturePopups() {
    const featureItems = document.querySelectorAll('.feature-list li');
    
    featureItems.forEach((item, index) => {
      const texts = [
        'We are fully licensed, bonded, and insured for your protection and peace of mind.',
        'Transparent pricing with detailed bids and clear scopes of work - no surprises.',
        'We maintain clean, organized job sites and professional, respectful crews.',
        'Meticulous attention to detail ensures exceptional finishing quality.'
      ];

      item.style.cursor = 'pointer';
      item.setAttribute('data-tooltip', texts[index] || 'Click to learn more');

      item.addEventListener('click', () => {
        if (window.showNotification) {
          window.showNotification(texts[index] || 'Learn more about this feature', 'info', 4000);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initServiceModal();
      initFeaturePopups();
    });
  } else {
    initServiceModal();
    initFeaturePopups();
  }
})();
