// AI Assistant functionality
(function() {
  'use strict';

  // Construction calculation functions
  function calculateArea(length, width) {
    return length * width;
  }

  function calculateVolume(length, width, height) {
    return length * width * height;
  }

  function calculateConcreteYards(length, width, depth) {
    const cubicFeet = length * width * (depth / 12);
    return (cubicFeet / 27).toFixed(2);
  }

  function calculateDrywallSheets(length, width, height) {
    const wallArea = 2 * (length + width) * height;
    const sheetArea = 32; // 4x8 sheet = 32 sq ft
    return Math.ceil(wallArea / sheetArea);
  }

  function calculatePaintGallons(area, coats = 2) {
    const coveragePerGallon = 350; // sq ft per gallon
    return Math.ceil((area * coats) / coveragePerGallon);
  }

  function calculateLumberBoardFeet(length, width, thickness) {
    return (length * width * thickness) / 12;
  }

  function calculateRoofingSquares(area) {
    return (area / 100).toFixed(2);
  }

  function calculateTileQuantity(area, tileSize) {
    const wasteFactor = 1.1; // 10% waste
    return Math.ceil((area / tileSize) * wasteFactor);
  }

  // Extract numbers from text
  function extractNumbers(text) {
    const numbers = text.match(/\d+\.?\d*/g);
    return numbers ? numbers.map(Number) : [];
  }

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
    area: {
      keywords: ['area', 'square feet', 'sq ft', 'sqft', 'calculate area', 'room size'],
      response: "To calculate area:\n\n📐 Formula: Area = Length × Width\n\nExample: A room 12 ft × 10 ft = 120 sq ft\n\nFor irregular shapes, break into rectangles and add areas together.\n\nCommon conversions:\n• 1 square foot = 144 square inches\n• 1 square yard = 9 square feet\n• 1 acre = 43,560 square feet"
    },
    volume: {
      keywords: ['volume', 'cubic feet', 'cubic yards', 'cu ft', 'cu yd', 'calculate volume'],
      response: "To calculate volume:\n\n📦 Formula: Volume = Length × Width × Height\n\nExample: A room 12 ft × 10 ft × 8 ft = 960 cubic feet\n\nFor concrete:\n• 1 cubic yard = 27 cubic feet\n• Standard concrete coverage: 1 cubic yard covers ~81 sq ft at 4 inches thick\n\nFormula for concrete yards:\nYards = (Length × Width × Depth in inches) ÷ 12 ÷ 27"
    },
    concrete: {
      keywords: ['concrete', 'cement', 'slab', 'foundation', 'how much concrete', 'concrete calculation'],
      response: "Concrete Calculation:\n\n🧱 Formula: Cubic Yards = (Length × Width × Depth in inches) ÷ 12 ÷ 27\n\nExample: 20 ft × 30 ft × 4 inches\n= (20 × 30 × 4) ÷ 12 ÷ 27\n= 2,400 ÷ 12 ÷ 27\n= 7.41 cubic yards\n\nStandard depths:\n• Driveway: 4-6 inches\n• Sidewalk: 4 inches\n• Foundation: 8-12 inches\n• Patio: 4 inches\n\nAdd 10% for waste. One cubic yard covers:\n• 81 sq ft at 4\" thick\n• 54 sq ft at 6\" thick\n• 40.5 sq ft at 8\" thick"
    },
    drywall: {
      keywords: ['drywall', 'sheetrock', 'gypsum', 'how many sheets', 'drywall calculation'],
      response: "Drywall Calculation:\n\n📋 Standard sheet size: 4 ft × 8 ft = 32 sq ft\n\nFormula: Sheets = Total Wall Area ÷ 32\n\nFor a room:\n• Calculate each wall: Length × Height\n• Add all walls together\n• Divide by 32\n• Add 10-15% for waste\n\nExample: Room 12 ft × 10 ft × 8 ft high\nWalls: 2(12×8) + 2(10×8) = 192 + 160 = 352 sq ft\nSheets: 352 ÷ 32 = 11 sheets\nWith waste: ~13 sheets\n\nCeiling: Length × Width ÷ 32"
    },
    paint: {
      keywords: ['paint', 'paint calculation', 'how much paint', 'gallons of paint'],
      response: "Paint Calculation:\n\n🎨 Coverage: 1 gallon covers ~350 sq ft (one coat)\n\nFormula: Gallons = (Total Area × Number of Coats) ÷ 350\n\nExample: 1,200 sq ft room, 2 coats\n= (1,200 × 2) ÷ 350\n= 6.86 gallons → 7 gallons\n\nFactors to consider:\n• Primer: 1 coat recommended\n• Texture: Add 20% more\n• High ceilings: Add 10-15%\n• Doors/windows: Subtract their area\n\nStandard room (12×10×8):\nWalls: ~352 sq ft = 1 gallon (1 coat)\nCeiling: 120 sq ft = 0.5 gallon (1 coat)"
    },
    lumber: {
      keywords: ['lumber', 'board feet', '2x4', '2x6', 'wood calculation', 'board foot'],
      response: "Lumber Calculation:\n\n🪵 Board Feet Formula:\nBoard Feet = (Length × Width × Thickness) ÷ 12\n\nExample: 8 ft × 6 in × 2 in\n= (8 × 6 × 2) ÷ 12\n= 8 board feet\n\nCommon sizes:\n• 2×4: 1.5\" × 3.5\" actual\n• 2×6: 1.5\" × 5.5\" actual\n• 2×8: 1.5\" × 7.25\" actual\n• 2×10: 1.5\" × 9.25\" actual\n\nStud spacing:\n• 16\" on center: ~0.75 studs per linear foot\n• 24\" on center: ~0.5 studs per linear foot\n\nWall studs: Height ÷ 16\" spacing + 1 (for each end)"
    },
    roofing: {
      keywords: ['roof', 'roofing', 'shingles', 'squares', 'roofing calculation'],
      response: "Roofing Calculation:\n\n🏠 Roofing Square = 100 sq ft\n\nFormula: Squares = Total Roof Area ÷ 100\n\nTo calculate roof area:\n1. Measure length and width of building\n2. Add overhang (typically 1-2 ft)\n3. Apply pitch multiplier:\n   • 4/12 pitch: 1.054\n   • 6/12 pitch: 1.118\n   • 8/12 pitch: 1.202\n   • 12/12 pitch: 1.414\n\nFormula: Roof Area = (Length × Width) × Pitch Multiplier\n\nExample: 30 ft × 40 ft, 6/12 pitch\n= (30 × 40) × 1.118\n= 1,341 sq ft\n= 13.41 squares\n\nAdd 10% for waste. Shingles typically come in 3 bundles per square."
    },
    flooring: {
      keywords: ['flooring', 'tile', 'carpet', 'hardwood', 'flooring calculation', 'how much tile'],
      response: "Flooring Calculation:\n\n🪚 Formula: Material Needed = Area ÷ Coverage per unit\n\nTile:\n• 12\"×12\" tile = 1 sq ft each\n• Add 10% waste\n• Formula: Tiles = (Length × Width) × 1.1\n\nHardwood:\n• Sold by sq ft\n• Add 5-10% waste\n• Example: 200 sq ft room = 210-220 sq ft needed\n\nCarpet:\n• Sold by sq ft or sq yd\n• 1 sq yd = 9 sq ft\n• Add 10% waste\n\nLaminate/Vinyl:\n• Sold by sq ft\n• Add 5-10% waste\n• Check box coverage (typically 20-30 sq ft per box)"
    },
    electrical: {
      keywords: ['electrical', 'wiring', 'outlets', 'circuits', 'electrical code'],
      response: "Electrical Basics:\n\n⚡ NEC (National Electrical Code) Guidelines:\n\nOutlets:\n• Living areas: Outlet every 12 ft\n• Kitchen: Outlet every 4 ft of counter\n• Bathroom: GFCI outlet required\n• Outdoor: Weatherproof outlets\n\nCircuit Capacity:\n• 15-amp circuit: 1,800 watts max\n• 20-amp circuit: 2,400 watts max\n• Formula: Watts = Volts × Amps\n\nWire Gauge:\n• 14 AWG: 15 amps\n• 12 AWG: 20 amps\n• 10 AWG: 30 amps\n\nVoltage Drop:\n• Keep runs under 100 ft for 120V\n• Use larger wire for longer runs"
    },
    plumbing: {
      keywords: ['plumbing', 'pipe', 'fixtures', 'water', 'drainage'],
      response: "Plumbing Basics:\n\n🚰 Pipe Sizing:\n• 1/2\" pipe: Up to 30 GPM\n• 3/4\" pipe: 30-50 GPM\n• 1\" pipe: 50-100 GPM\n\nFixture Requirements:\n• Toilet: 3/4\" supply, 4\" drain\n• Sink: 1/2\" supply, 1.5\" drain\n• Shower: 1/2\" supply, 2\" drain\n• Bathtub: 1/2\" supply, 1.5\" drain\n\nWater Pressure:\n• Minimum: 40 PSI\n• Optimal: 50-60 PSI\n• Maximum: 80 PSI\n\nDrain Slope:\n• Minimum: 1/4\" per foot (2%)\n• Optimal: 1/2\" per foot (4%)"
    },
    insulation: {
      keywords: ['insulation', 'r-value', 'thermal', 'energy'],
      response: "Insulation Guide:\n\n🧊 R-Value Requirements (Los Angeles area):\n• Attic: R-30 to R-60\n• Walls: R-13 to R-21\n• Floors: R-13 to R-19\n\nCommon Materials:\n• Fiberglass batts: R-3.1 to R-3.8 per inch\n• Spray foam: R-6 to R-7 per inch\n• Rigid foam: R-4 to R-6.5 per inch\n\nCalculation:\nR-Value = Material R-value per inch × Thickness\n\nExample: 6\" fiberglass (R-3.5/inch)\n= 3.5 × 6 = R-21\n\nEnergy Savings:\n• Proper insulation can reduce energy costs by 20-30%"
    },
    cost: {
      keywords: ['cost', 'price', 'budget', 'estimate', 'cost per square foot', 'construction cost'],
      response: "Construction Cost Estimates:\n\n💰 Average Costs (Los Angeles area):\n\nResidential:\n• New construction: $150-$300/sq ft\n• Remodel: $100-$250/sq ft\n• Kitchen remodel: $15,000-$50,000\n• Bathroom: $10,000-$30,000\n• ADU: $150,000-$300,000\n\nCommercial:\n• Office build-out: $50-$150/sq ft\n• Retail: $75-$200/sq ft\n• Restaurant: $150-$300/sq ft\n\nFactors affecting cost:\n• Location and permits\n• Material quality\n• Labor costs\n• Project complexity\n• Timeline\n\nCost Breakdown:\n• Materials: 40-50%\n• Labor: 30-40%\n• Overhead: 10-15%\n• Profit: 10-15%"
    },
    buildingcode: {
      keywords: ['code', 'building code', 'permit', 'regulation', 'compliance', 'inspection'],
      response: "Building Codes (Los Angeles):\n\n📋 Key Requirements:\n\nSetbacks:\n• Front: 20 ft minimum\n• Side: 5 ft minimum\n• Rear: 20 ft minimum\n\nHeight Limits:\n• Single story: 18 ft max\n• Two story: 30 ft max\n• With ADU: Varies by zone\n\nADU Requirements:\n• Max size: 1,200 sq ft or 50% of main house\n• Min size: 150 sq ft\n• Height: 16 ft max\n• Setbacks: 4 ft from property line\n\nPermits Required:\n• Structural changes\n• Electrical work\n• Plumbing modifications\n• HVAC installation\n• Roofing replacement\n\nInspection Stages:\n1. Foundation\n2. Framing\n3. Electrical/Plumbing\n4. Final"
    },
    measurements: {
      keywords: ['convert', 'conversion', 'feet to inches', 'square feet', 'measurement'],
      response: "Construction Conversions:\n\n📏 Length:\n• 1 foot = 12 inches\n• 1 yard = 3 feet\n• 1 mile = 5,280 feet\n\nArea:\n• 1 sq ft = 144 sq inches\n• 1 sq yard = 9 sq ft\n• 1 acre = 43,560 sq ft\n• 1 hectare = 2.47 acres\n\nVolume:\n• 1 cubic foot = 1,728 cubic inches\n• 1 cubic yard = 27 cubic feet\n• 1 gallon = 231 cubic inches\n\nWeight:\n• 1 ton = 2,000 lbs\n• Concrete: ~150 lbs/cubic foot\n• Drywall: ~2 lbs/sq ft\n\nCommon:\n• Stud spacing: 16\" or 24\" on center\n• Sheet sizes: 4'×8' (drywall, plywood)\n• Standard door: 80\" × 30\" or 36\""
    },
    default: {
      response: "I'm here to help with construction questions! I can assist with:\n\n📐 Calculations: Area, volume, materials (concrete, drywall, paint, lumber)\n🏗️ Building codes and permits\n💰 Cost estimates\n📏 Measurements and conversions\n⚡ Electrical and plumbing basics\n🧊 Insulation and energy efficiency\n🏠 Roofing, flooring, and more\n\nAsk me about:\n• \"How much concrete for a 20×30 slab?\"\n• \"Calculate drywall for a 12×10 room\"\n• \"What's the cost per square foot?\"\n• \"Building code requirements\"\n\nOr ask about our services at HH Construction Group Inc.!"
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
    addMessage('assistant', "Hello! I'm your construction assistant for HH Construction Group Inc. 👷🏻‍♂️\n\nI can help with:\n📐 Construction calculations (area, volume, materials)\n🧱 Material estimates (concrete, drywall, paint, lumber)\n💰 Cost estimates and building codes\n📏 Measurements and conversions\n\nTry asking:\n• \"Calculate concrete for a 20×30 slab\"\n• \"How much drywall for a 12×10 room?\"\n• \"What's the cost per square foot?\"\n\nOr ask about our services! How can I help you today?");

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
      const numbers = extractNumbers(userMessage);

      // Handle specific calculations
      if (lowerMessage.includes('calculate') || lowerMessage.includes('how much') || lowerMessage.includes('how many')) {
        // Area calculation
        if ((lowerMessage.includes('area') || lowerMessage.includes('square feet')) && numbers.length >= 2) {
          const area = calculateArea(numbers[0], numbers[1]);
          return `📐 Area Calculation:\n\nLength: ${numbers[0]} ft\nWidth: ${numbers[1]} ft\n\nArea = ${numbers[0]} × ${numbers[1]} = ${area} sq ft`;
        }

        // Volume calculation
        if (lowerMessage.includes('volume') && numbers.length >= 3) {
          const volume = calculateVolume(numbers[0], numbers[1], numbers[2]);
          return `📦 Volume Calculation:\n\nLength: ${numbers[0]} ft\nWidth: ${numbers[1]} ft\nHeight: ${numbers[2]} ft\n\nVolume = ${numbers[0]} × ${numbers[1]} × ${numbers[2]} = ${volume} cubic feet\n\nIn cubic yards: ${(volume / 27).toFixed(2)} cu yd`;
        }

        // Concrete calculation
        if ((lowerMessage.includes('concrete') || lowerMessage.includes('cement') || lowerMessage.includes('slab')) && numbers.length >= 2) {
          const depth = numbers.length >= 3 ? numbers[2] : 4; // Default 4 inches
          const yards = calculateConcreteYards(numbers[0], numbers[1], depth);
          return `🧱 Concrete Calculation:\n\nLength: ${numbers[0]} ft\nWidth: ${numbers[1]} ft\nDepth: ${depth} inches\n\nCubic Yards = (${numbers[0]} × ${numbers[1]} × ${depth}) ÷ 12 ÷ 27\n= ${yards} cubic yards\n\n💡 Add 10% for waste: ${(parseFloat(yards) * 1.1).toFixed(2)} cubic yards\n\nCoverage: ${(numbers[0] * numbers[1]).toFixed(0)} sq ft at ${depth}" thick`;
        }

        // Drywall calculation
        if ((lowerMessage.includes('drywall') || lowerMessage.includes('sheetrock')) && numbers.length >= 2) {
          const height = numbers.length >= 3 ? numbers[2] : 8; // Default 8 ft
          const sheets = calculateDrywallSheets(numbers[0], numbers[1], height);
          return `📋 Drywall Calculation:\n\nRoom: ${numbers[0]} ft × ${numbers[1]} ft × ${height} ft high\n\nWall area: 2(${numbers[0]} + ${numbers[1]}) × ${height} = ${(2 * (numbers[0] + numbers[1]) * height).toFixed(0)} sq ft\n\nSheets needed: ${sheets} sheets (4×8 = 32 sq ft each)\n\n💡 Add 10-15% for waste: ${Math.ceil(sheets * 1.15)} sheets`;
        }

        // Paint calculation
        if (lowerMessage.includes('paint') && numbers.length >= 1) {
          const area = numbers.length >= 2 ? calculateArea(numbers[0], numbers[1]) : numbers[0];
          const coats = lowerMessage.includes('coat') ? extractNumbers(userMessage).find(n => n <= 5) || 2 : 2;
          const gallons = calculatePaintGallons(area, coats);
          return `🎨 Paint Calculation:\n\nArea: ${area} sq ft\nCoats: ${coats}\n\nCoverage: 1 gallon = 350 sq ft (1 coat)\n\nGallons needed = (${area} × ${coats}) ÷ 350\n= ${gallons} gallons\n\n💡 Consider primer separately if needed`;
        }

        // Roofing calculation
        if ((lowerMessage.includes('roof') || lowerMessage.includes('shingle')) && numbers.length >= 2) {
          const area = calculateArea(numbers[0], numbers[1]);
          const squares = calculateRoofingSquares(area);
          return `🏠 Roofing Calculation:\n\nRoof area: ${numbers[0]} ft × ${numbers[1]} ft = ${area} sq ft\n\nSquares = ${area} ÷ 100 = ${squares} squares\n\n💡 Add 10% for waste: ${(parseFloat(squares) * 1.1).toFixed(2)} squares\n\nShingles: ~${Math.ceil(parseFloat(squares) * 3)} bundles (3 bundles per square)`;
        }
      }

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
