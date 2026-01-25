// Smooth Navigation - Prevents page reload on internal navigation

(function() {
  'use strict';

  // Check if browser supports required APIs and we're not on file:// protocol
  if (!window.fetch || !window.History || window.location.protocol === 'file:') {
    return; // Fallback to normal navigation
  }

  let isNavigating = false;
  let currentUrl = window.location.href;

  // Get the main content container
  function getMainContent() {
    const main = document.querySelector('main');
    if (main) return main;
    
    // Fallback: get body content excluding header and footer
    const body = document.body;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    // Create a wrapper if needed
    if (!document.querySelector('.main-content-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'main-content-wrapper';
      
      // Move all content except header and footer into wrapper
      Array.from(body.children).forEach(child => {
        if (child !== header && child !== footer && 
            !child.classList.contains('entrance-animation') &&
            !child.classList.contains('ai-assistant')) {
          wrapper.appendChild(child);
        }
      });
      
      body.insertBefore(wrapper, footer || null);
      return wrapper;
    }
    
    return document.querySelector('.main-content-wrapper') || body;
  }

  // Check if link is internal
  function isInternalLink(url) {
    try {
      const linkUrl = new URL(url, window.location.origin);
      const currentUrlObj = new URL(window.location.href);
      
      // Same origin and not a hash link
      return linkUrl.origin === currentUrlObj.origin && 
             linkUrl.pathname !== currentUrlObj.pathname;
    } catch(e) {
      return false;
    }
  }

  // Extract main content from HTML string
  function extractContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Get main content - try main first, then body content
    let main = doc.querySelector('main');
    if (!main) {
      // Extract body content excluding header, footer, scripts
      const body = doc.body;
      const header = body.querySelector('header');
      const footer = body.querySelector('footer');
      const scripts = body.querySelectorAll('script');
      
      main = document.createElement('div');
      Array.from(body.children).forEach(child => {
        if (child !== header && child !== footer && 
            !Array.from(scripts).includes(child) &&
            !child.classList.contains('entrance-animation') &&
            !child.classList.contains('ai-assistant')) {
          main.appendChild(child.cloneNode(true));
        }
      });
    }
    
    // Get scripts that need to be re-executed
    const scripts = doc.querySelectorAll('script[src]');
    const inlineScripts = doc.querySelectorAll('script:not([src])');
    
    return {
      content: main.innerHTML,
      title: doc.title,
      scripts: Array.from(scripts).map(s => s.src),
      inlineScripts: Array.from(inlineScripts).map(s => s.textContent)
    };
  }

  // Load page content
  async function loadPage(url) {
    try {
      // Ensure URL is absolute
      const absoluteUrl = url.startsWith('http') ? url : new URL(url, window.location.origin).href;
      
      const response = await fetch(absoluteUrl, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      if (!html || html.trim().length === 0) {
        throw new Error('Empty response');
      }
      
      return extractContent(html);
    } catch(error) {
      console.error('Navigation error:', error);
      console.error('Failed URL:', url);
      return null;
    }
  }

  // Update page content smoothly
  function updatePage(data, url) {
    if (!data) return false;

    const mainContent = getMainContent();
    
    // Add fade-out class
    document.body.classList.add('page-transitioning');
    
    setTimeout(() => {
      // Update title
      document.title = data.title;
      
      // Update content
      mainContent.innerHTML = data.content;
      
      // Update active nav link
      updateActiveNavLink(url);
      
      // Re-execute inline scripts
      data.inlineScripts.forEach(scriptText => {
        try {
          const script = document.createElement('script');
          script.textContent = scriptText;
          document.body.appendChild(script);
          document.body.removeChild(script);
        } catch(e) {
          console.warn('Script execution error:', e);
        }
      });
      
      // Load external scripts
      const existingScripts = new Set(
        Array.from(document.querySelectorAll('script[src]')).map(s => s.src)
      );
      
      data.scripts.forEach(src => {
        if (!existingScripts.has(src)) {
          const script = document.createElement('script');
          script.src = src;
          script.defer = true;
          document.body.appendChild(script);
        }
      });
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Remove fade-out, add fade-in
      setTimeout(() => {
        document.body.classList.remove('page-transitioning');
        document.body.classList.add('page-loaded');
        setTimeout(() => {
          document.body.classList.remove('page-loaded');
        }, 300);
      }, 50);
      
      // Update URL without reload
      window.history.pushState({ url: url }, '', url);
      currentUrl = url;
      
      isNavigating = false;
    }, 150);
    
    return true;
  }

  // Update active navigation link
  function updateActiveNavLink(url) {
    const navLinks = document.querySelectorAll('.main-nav a, footer a[href^="./"]');
    const urlPath = new URL(url, window.location.origin).pathname;
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname;
      if (linkPath === urlPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle link clicks
  function handleLinkClick(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Skip if:
    // - External links
    // - Hash links (anchors)
    // - Already navigating
    // - Special links (mailto, tel, etc.)
    if (isNavigating || 
        href.startsWith('#') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('http') && !isInternalLink(href)) {
      return;
    }
    
    // Check if internal link
    if (isInternalLink(href)) {
      e.preventDefault();
      navigateTo(href);
    }
  }

  // Navigate to URL
  async function navigateTo(url) {
    if (isNavigating) return;
    
    try {
      isNavigating = true;
      const fullUrl = new URL(url, window.location.origin).href;
      
      const pageData = await loadPage(fullUrl);
      if (pageData && pageData.content) {
        updatePage(pageData, fullUrl);
      } else {
        // Fallback to normal navigation if fetch fails
        isNavigating = false;
        window.location.href = fullUrl;
      }
    } catch(error) {
      console.error('Navigation failed, using fallback:', error);
      isNavigating = false;
      // Fallback to normal navigation
      window.location.href = url;
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', async (e) => {
    try {
      const url = window.location.href;
      if (url !== currentUrl) {
        isNavigating = true;
        const pageData = await loadPage(url);
        if (pageData && pageData.content) {
          updatePage(pageData, url);
        } else {
          isNavigating = false;
          window.location.reload();
        }
      }
    } catch(error) {
      console.error('Popstate navigation failed:', error);
      isNavigating = false;
      window.location.reload();
    }
  });

  // Attach click listeners
  try {
    document.addEventListener('click', handleLinkClick, true);
    // Initialize active nav link
    updateActiveNavLink(window.location.href);
  } catch(error) {
    console.error('Smooth navigation initialization error:', error);
    // Script will silently fail and use normal navigation
  }
})();
