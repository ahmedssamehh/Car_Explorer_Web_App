/**
 * Theme Management Module
 * Handles switching between Sport Mode and Eco Mode
 */

// Get current theme from localStorage or default to 'eco'
const getCurrentTheme = () => {
  return localStorage.getItem('theme') || 'eco';
};

// Set theme
const setTheme = (theme) => {
  // Add transition class
  document.body.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
  
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Keep video always visible, just change overlay
  const video = document.getElementById('hero-video');
  const videoOverlay = document.querySelector('.video-overlay');
  
  if (video) {
    // Always show video in background
    video.style.display = 'block';
    video.style.opacity = '1';
    
    // Ensure video is playing
    const playVideo = () => {
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
        // Try again on user interaction
        document.addEventListener('click', () => {
          video.play().catch(e => console.log('Still blocked:', e));
        }, { once: true });
      });
    };
    
    if (video.readyState >= 2) {
      // Video is ready
      playVideo();
    } else {
      // Wait for video to load
      video.addEventListener('loadeddata', playVideo);
    }
  }
  
  // Overlay color changes based on theme
  if (videoOverlay) {
    videoOverlay.style.display = 'block';
  }
  
  // Update document colors dynamically
  updateThemeColors(theme);
};

// Toggle theme
const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'sport' ? 'eco' : 'sport';
  setTheme(newTheme);
};

// Initialize theme on page load
const initTheme = () => {
  const theme = getCurrentTheme();
  setTheme(theme);
  
  // Add event listener to theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
};

// Navbar scroll effect
const initNavbarScroll = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
};

// Parallax effect
const initParallax = () => {
  const heroContent = document.querySelector('.parallax-content');
  if (!heroContent) return;
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    
    heroContent.style.transform = `translate(${xPercent * 10}px, ${yPercent * 10}px)`;
  };
  
  window.addEventListener('mousemove', handleMouseMove);
};

// Update theme-specific colors
const updateThemeColors = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'sport') {
    // Sport Mode: Red & Black
    root.style.setProperty('--primary-color', '#FF0000');
    root.style.setProperty('--secondary-color', '#000000');
    root.style.setProperty('--text-color', '#FFFFFF');
    root.style.setProperty('--accent-color', '#8B0000');
  } else {
    // Eco Mode: Green & White
    root.style.setProperty('--primary-color', '#22C55E');
    root.style.setProperty('--secondary-color', '#FFFFFF');
    root.style.setProperty('--text-color', '#1F2937');
    root.style.setProperty('--accent-color', '#16A34A');
  }
};

// Add smooth scroll behavior
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Initialize all theme-related features
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initParallax();
  initSmoothScroll();
  
  console.log('🎨 Theme system initialized!');
});

// Export functions for use in other modules
export { getCurrentTheme, setTheme, toggleTheme };

