// Entrance Animation Controller - Company Name Pop-up & Slide Up

class EntranceAnimation {
  constructor() {
    this.container = document.querySelector('.entrance-animation');
    this.companyName = document.querySelector('.company-name');
    
    if (!this.container) return;
    
    // Check navigation type for reload/refresh
    let isReload = false;
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry && navEntry.type === 'reload') {
        isReload = true;
      } else if (performance.navigation) {
        // Fallback for older browsers
        if (performance.navigation.type === 1) {
          isReload = true;
        }
      }
    } catch(e) {
      // If performance API not available, check if referrer is same as current URL
      const referrerCheck = document.referrer || '';
      if (referrerCheck === window.location.href) {
        isReload = true;
      }
    }
    
    // Check referrer
    const referrer = document.referrer || '';
    const hostname = window.location.hostname;
    
    // Check if referrer is from Google search (various Google domains)
    let isGoogleSearch = false;
    if (referrer) {
      const googleDomains = ['google.com', 'google.co.uk', 'google.ca', 'google.com.au', 'google.de', 'google.fr', 'google.it', 'google.es', 'google.nl', 'google.pl', 'google.ru', 'google.co.jp', 'google.co.in', 'google.com.br', 'google.com.mx', 'google.com.tr', 'google.co.kr', 'google.com.hk', 'google.com.sg', 'google.com.tw', 'google.co.za', 'google.com.ar', 'google.cl', 'google.com.co', 'google.com.pe', 'google.com.ua', 'google.com.vn', 'google.com.ph', 'google.com.my', 'google.co.id', 'google.com.bd', 'google.com.pk', 'google.com.eg', 'google.com.sa', 'google.ae', 'google.co.il', 'google.com.nz', 'google.ie', 'google.be', 'google.at', 'google.ch', 'google.se', 'google.no', 'google.dk', 'google.fi', 'google.pt', 'google.cz', 'google.ro', 'google.hu', 'google.gr', 'google.bg', 'google.sk', 'google.si', 'google.hr', 'google.lt', 'google.lv', 'google.ee', 'google.lu', 'google.is', 'google.mk', 'google.rs', 'google.ba', 'google.me', 'google.al', 'google.by', 'google.md', 'google.ge', 'google.am', 'google.az', 'google.kz', 'google.kg', 'google.tj', 'google.tm', 'google.uz', 'google.mn'];
      for (let i = 0; i < googleDomains.length; i++) {
        if (referrer.includes(googleDomains[i])) {
          isGoogleSearch = true;
          break;
        }
      }
    }
    
    // Check if referrer is from same domain (internal navigation)
    let isSameDomain = false;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(window.location.href);
        const referrerHost = referrerUrl.hostname.replace(/^www\./, '');
        const currentHost = currentUrl.hostname.replace(/^www\./, '');
        
        // Check if same hostname
        if (referrerHost === currentHost) {
          isSameDomain = true;
        } else if (referrerHost === '' && currentHost === '') {
          // Both are file:// or local - treat as same domain
          isSameDomain = true;
        }
        
        // Also check if referrer pathname suggests internal navigation
        if (isSameDomain) {
          const referrerPath = referrerUrl.pathname.toLowerCase();
          // If coming from about or contact pages, definitely same domain
          if (referrerPath.includes('aboutpage.html') || 
              referrerPath.includes('contuctus.html') ||
              referrerPath.includes('contuctus.html') ||
              referrerPath.includes('/about') ||
              referrerPath.includes('/contact')) {
            isSameDomain = true;
          }
        }
      } catch(e) {
        // Fallback: simple string check
        if (referrer.includes(hostname) || 
            referrer.includes(window.location.host) ||
            (hostname === '' && referrer.startsWith('file://'))) {
          isSameDomain = true;
        }
      }
    }
    
    // Show animation if:
    // 1. Reload/refresh (updating the website)
    // 2. Coming from Google search
    // 3. No referrer (direct entry/search bar)
    // 4. External referrer (not same domain)
    // Hide animation if navigating from about/contact pages (same domain)
    let shouldShow = false;
    
    if (isReload) {
      // Reload/refresh - show animation
      shouldShow = true;
    } else if (isGoogleSearch) {
      // Coming from Google search - always show animation
      shouldShow = true;
    } else if (!referrer) {
      // No referrer - direct entry/search bar - show animation
      shouldShow = true;
    } else if (!isSameDomain) {
      // External referrer (different domain) - show animation
      shouldShow = true;
    }
    // If same domain navigation (from about/contact), don't show (shouldShow stays false)
    
    // Skip animation only if we shouldn't show it
    if (!shouldShow) {
      this.skipAnimation();
      return; // Exit early
    }
    
    // Show animation
    this.init();
  }
  
  skipAnimation() {
    // Hide animation immediately without showing it
    if (this.container) {
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      this.container.style.opacity = '0';
      this.container.style.pointerEvents = 'none';
    }
    // Ensure body is not locked
    document.body.classList.remove('animation-active');
  }
  
  init() {
    // Reset animation state - show animation
    this.container.style.display = 'flex';
    this.container.style.visibility = 'visible';
    this.container.style.opacity = '1';
    this.container.classList.remove('completed');
    
    // Prevent body scroll during animation
    document.body.classList.add('animation-active');
    
    // Start animation sequence
    setTimeout(() => this.startAnimation(), 100);
  }
  
  startAnimation() {
    // Image reveals at 0.1s, company name pops up at 1.1s (handled by CSS animation)
    // After name appears, wait then slide up
    // Shorter duration on mobile for better UX
    const isMobile = window.innerWidth <= 480;
    const animationDuration = isMobile ? 2500 : 3200; // Faster on mobile
    
    setTimeout(() => {
      this.complete();
    }, animationDuration);
  }
  
  complete() {
    // Slide up animation
    this.container.classList.add('completed');
    
    // Fade out and hide container
    setTimeout(() => {
      // Ensure body background is maintained before removing class
      const bodyBg = getComputedStyle(document.body).background;
      
      // Remove animation class
      document.body.classList.remove('animation-active');
      
      // Reset all body styles to prevent color/position issues
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Force body background to be visible
      if (!document.body.style.background || document.body.style.background === 'none') {
        document.body.style.background = 'radial-gradient(circle at top, #111111 0, #000 45%, #000 100%)';
        document.body.style.backgroundAttachment = 'fixed';
      }
      
      // Hide container completely
      this.container.style.display = 'none';
      this.container.style.visibility = 'hidden';
      this.container.style.opacity = '0';
    }, 1500); // Wait for both transform and opacity transitions
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EntranceAnimation();
  });
} else {
  new EntranceAnimation();
}
