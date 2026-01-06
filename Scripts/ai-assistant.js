// AI Assistant functionality
(function() {
  'use strict';

  // AI Assistant knowledge base for construction-related questions
  const knowledgeBase = {
    services: {
      keywords: ['service', 'services', 'what do you do', 'what can you do', 'offer', 'offerings'],
      response: "We offer comprehensive construction services including:\n\n• Residential Construction: Custom homes, ADUs, and additions\n• Commercial Projects: Offices, retail spaces, and tenant improvements\n• Remodels & Renovations: Kitchens, bathrooms, exteriors, and full remodels\n\nAll projects are handled with careful planning, clear communication, and high-quality finishes."
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'reach', 'call', 'get in touch', 'address', 'location'],
      response: "You can reach us through:\n\n📞 Phone: (818) 666-5558 or (707) 400-0074\n📧 Email: contact@hhconstructions.net\n📍 Location: Los Angeles, CA\n\nBusiness Hours:\nMonday - Friday: 8:00 AM - 4:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed\n\nYou can also fill out our contact form for a free estimate!"
    },
    quote: {
      keywords: ['quote', 'estimate', 'price', 'cost', 'pricing', 'how much', 'free estimate'],
      response: "We provide free, no-obligation estimates for all projects! Simply fill out our contact form with details about your project, and we'll get back to you shortly with a comprehensive quote.\n\nTo get started, visit our Contact page or tell me about your project and I can help guide you."
    },
    residential: {
      keywords: ['residential', 'home', 'house', 'adu', 'addition', 'custom home'],
      response: "Our residential construction services include:\n\n🏠 Custom home construction\n🏘️ ADUs (Accessory Dwelling Units)\n➕ Home additions and expansions\n\nWe handle everything from planning and permits to final finishes. Each project is tailored to your needs with careful attention to detail and quality craftsmanship."
    },
    commercial: {
      keywords: ['commercial', 'office', 'retail', 'business', 'tenant'],
      response: "For commercial projects, we specialize in:\n\n🏢 Office build-outs and renovations\n🏪 Retail space improvements\n🏬 Tenant improvements\n\nOur commercial work is designed to look professional and function perfectly for your business needs."
    },
    remodel: {
      keywords: ['remodel', 'renovation', 'renovate', 'kitchen', 'bathroom', 'upgrade'],
      response: "We handle all types of remodels and renovations:\n\n🍳 Kitchen remodels\n🚿 Bathroom renovations\n🏡 Full home remodels\n🏛️ Exterior upgrades\n\nOur remodels bring old spaces to a new level with modern finishes and improved functionality."
    },
    licensed: {
      keywords: ['licensed', 'license', 'bonded', 'insured', 'certified', 'credentials'],
      response: "Yes! HH Construction Group Inc. is a fully licensed, bonded, and insured general contractor. We maintain all required certifications and insurance to ensure your project is protected and completed to the highest standards."
    },
    timeline: {
      keywords: ['timeline', 'how long', 'duration', 'schedule', 'when', 'timeframe'],
      response: "Project timelines vary based on scope and complexity. We provide detailed schedules during the planning phase and keep you updated throughout the project. Typical timelines:\n\n• Small remodels: 2-4 weeks\n• Medium projects: 1-3 months\n• Large builds: 3-6+ months\n\nContact us with your project details for a more specific timeline estimate."
    },
    process: {
      keywords: ['process', 'how it works', 'steps', 'procedure', 'workflow'],
      response: "Our construction process:\n\n1️⃣ Initial consultation and project discussion\n2️⃣ Detailed planning and design review\n3️⃣ Permits and approvals\n4️⃣ Clear scope, budget, and timeline\n5️⃣ Construction with regular updates\n6️⃣ Final walkthrough and completion\n\nWe keep communication simple and transparent throughout every step."
    },
    default: {
      response: "I'm here to help with questions about HH Construction Group Inc.! I can assist with:\n\n• Our services (residential, commercial, remodels)\n• Getting a free estimate\n• Contact information\n• Project timelines and process\n• Licensing and credentials\n\nWhat would you like to know? Or feel free to ask me anything about construction projects!"
    }
  };

  // Initialize AI Assistant
  function initAIAssistant() {
    const button = document.getElementById('aiAssistantButton');
    const window = document.getElementById('aiAssistantWindow');
    const closeBtn = document.getElementById('aiAssistantClose');
    const input = document.getElementById('aiAssistantInput');
    const sendBtn = document.getElementById('aiAssistantSend');
    const messagesContainer = document.getElementById('aiAssistantMessages');
    const quickActions = document.querySelectorAll('.ai-quick-action');

    if (!button || !window || !messagesContainer) return;

    // Add welcome message
    addMessage('assistant', "Hello! I'm your construction assistant for HH Construction Group Inc. 👷🏻‍♂️\n\nI can help answer questions about our services, get you a free estimate, or connect you with our team. How can I assist you today?");

    // Toggle window
    button.addEventListener('click', () => {
      const isOpen = window.classList.toggle('open');
      button.classList.toggle('active', isOpen);
      if (isOpen) {
        input.focus();
      }
    });

    // Close window
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.classList.remove('open');
        button.classList.remove('active');
      });
    }

    // Send message on button click
    if (sendBtn) {
      sendBtn.addEventListener('click', handleSendMessage);
    }

    // Send message on Enter key
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      });
    }

    // Quick action buttons
    quickActions.forEach(action => {
      action.addEventListener('click', () => {
        const text = action.textContent.trim();
        input.value = text;
        handleSendMessage();
      });
    });

    function handleSendMessage() {
      const message = input.value.trim();
      if (!message) return;

      // Add user message
      addMessage('user', message);
      input.value = '';
      sendBtn.disabled = true;

      // Show typing indicator
      const typingId = showTypingIndicator();

      // Simulate AI response delay
      setTimeout(() => {
        removeTypingIndicator(typingId);
        const response = getAIResponse(message);
        addMessage('assistant', response);
        sendBtn.disabled = false;
        input.focus();
      }, 1000 + Math.random() * 1000);
    }

    function addMessage(type, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ai-message ${type}`;

      const avatar = document.createElement('div');
      avatar.className = 'ai-message-avatar';
      avatar.innerHTML = type === 'user' ? '<i class="fa-solid fa-user"></i>' : '👷🏻‍♂️';

      const content = document.createElement('div');
      content.className = 'ai-message-content';
      content.textContent = text;

      messageDiv.appendChild(avatar);
      messageDiv.appendChild(content);
      messagesContainer.appendChild(messageDiv);

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-message assistant';
      typingDiv.id = 'typing-indicator';

      const avatar = document.createElement('div');
      avatar.className = 'ai-message-avatar';
      avatar.innerHTML = '👷🏻‍♂️';

      const content = document.createElement('div');
      content.className = 'ai-message-content';
      content.innerHTML = '<div class="ai-message-typing"><span></span><span></span><span></span></div>';

      typingDiv.appendChild(avatar);
      typingDiv.appendChild(content);
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      return 'typing-indicator';
    }

    function removeTypingIndicator(id) {
      const indicator = document.getElementById(id);
      if (indicator) {
        indicator.remove();
      }
    }

    function getAIResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();

      // Check each knowledge base entry
      for (const [key, data] of Object.entries(knowledgeBase)) {
        if (key === 'default') continue;
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
          return data.response;
        }
      }

      // Check for greeting
      if (lowerMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
        return "Hello! 👋 Thanks for reaching out to HH Construction Group Inc. How can I help you with your construction project today?";
      }

      // Check for thank you
      if (lowerMessage.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
        return "You're welcome! 😊 If you have any more questions about our services or need help with your project, feel free to ask. You can also contact us directly at (818) 666-5558 or visit our contact page for a free estimate!";
      }

      // Default response
      return knowledgeBase.default.response;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
  } else {
    initAIAssistant();
  }
})();
