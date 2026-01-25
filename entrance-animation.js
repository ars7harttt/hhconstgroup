// Entrance Animation Controller - Company Name Pop-up & Slide Up

class EntranceAnimation {
  constructor() {
    this.container = document.querySelector('.entrance-animation');
    this.companyName = document.querySelector('.company-name');
    
    if (!this.container) return;
    
    // Check if user has visited before - do this immediately
    const hasVisited = localStorage.getItem('hhconstgroup_visited');
    
    if (hasVisited === 'true') {
      // User has visited before, skip animation completely
      this.skipAnimation();
      return; // Exit early
    }
    
    // First visit, mark as visited immediately before showing animation
    localStorage.setItem('hhconstgroup_visited', 'true');
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
    // Reset animation state - only show on first visit
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
