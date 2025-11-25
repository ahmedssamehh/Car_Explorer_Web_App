/**
 * Advanced Animations and Scroll Effects
 * Handles scroll-triggered animations, number counting, and interactive effects
 */

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================

const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
};

// ===========================
// NUMBER COUNTING ANIMATION
// ===========================

const initNumberCounting = () => {
  const statCards = document.querySelectorAll('.stat-card');
  
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateNumber(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, {
    threshold: 0.5
  });
  
  statCards.forEach(card => {
    countObserver.observe(card);
  });
};

const animateNumber = (card) => {
  const numberElement = card.querySelector('.stat-number');
  const target = parseInt(numberElement.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  const updateNumber = () => {
    current += increment;
    if (current < target) {
      numberElement.textContent = Math.floor(current);
      requestAnimationFrame(updateNumber);
    } else {
      numberElement.textContent = target;
    }
  };
  
  requestAnimationFrame(updateNumber);
};

// ===========================
// PARALLAX SCROLL EFFECT
// ===========================

const initParallaxScroll = () => {
  const parallaxElements = document.querySelectorAll('.feature-card, .stat-card');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.1 + (index * 0.05);
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const offset = (scrolled - elementTop) * speed;
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  });
};

// ===========================
// SMOOTH BUTTON INTERACTIONS
// ===========================

const initButtonEffects = () => {
  const buttons = document.querySelectorAll('.btn-primary, .navbar-link');
  
  buttons.forEach(button => {
    // Ripple effect on click
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple-effect');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
    
    // Magnetic effect on hover
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
};

// ===========================
// ENHANCED THEME TRANSITIONS
// ===========================

const enhanceThemeTransitions = () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Add a pulse effect to the entire page
      document.body.style.animation = 'pulse-theme 0.5s ease-out';
      
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
    });
  }
};

// ===========================
// FLOATING SHAPES ANIMATION
// ===========================

const initFloatingShapes = () => {
  const shapes = document.querySelectorAll('.floating-shape');
  
  shapes.forEach((shape, index) => {
    // Add random animation delays for more natural movement
    const randomDelay = Math.random() * 5;
    shape.style.animationDelay = `${randomDelay}s`;
    
    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const factor = (index + 1) * 0.5;
      
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
};

// ===========================
// SCROLL PROGRESS INDICATOR
// ===========================

const initScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress-bar');
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
};

// ===========================
// NAVBAR ANIMATION ON SCROLL
// ===========================

const enhanceNavbarAnimation = () => {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
};

// ===========================
// MOBILE MENU
// ===========================

const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
        }
    });
};

// ===========================
// INITIALIZE ALL ANIMATIONS
// ===========================

const initAllAnimations = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollReveal();
            initNumberCounting();
            // initParallaxScroll(); // Commented out for better mobile performance
            initButtonEffects();
            enhanceThemeTransitions();
            initFloatingShapes();
            initScrollProgress();
            enhanceNavbarAnimation();
            initMobileMenu();
        });
    } else {
        initScrollReveal();
        initNumberCounting();
        // initParallaxScroll(); // Commented out for better mobile performance
        initButtonEffects();
        enhanceThemeTransitions();
        initFloatingShapes();
        initScrollProgress();
        enhanceNavbarAnimation();
        initMobileMenu();
    }
};

// ===========================
// ADDITIONAL CSS FOR EFFECTS
// ===========================

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    pointer-events: none;
    animation: ripple-animation 0.6s ease-out;
  }
  
  @keyframes ripple-animation {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .scroll-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #FF0000 0%, #FF6B6B 100%);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s ease-out;
  }
  
  body[data-theme="eco"] .scroll-progress-bar {
    background: linear-gradient(90deg, #22C55E 0%, #10B981 100%);
  }
  
  .navbar {
    transition: transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;
  }
  
  @keyframes pulse-theme {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.95;
    }
  }
  
  /* Smooth all transitions */
  * {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Even smoother hover effects */
  .btn-primary:hover,
  .feature-card:hover,
  .stat-card:hover {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
`;
document.head.appendChild(style);

// ===========================
// RUN ANIMATIONS
// ===========================

initAllAnimations();

console.log('🎨 Advanced animations initialized!');

