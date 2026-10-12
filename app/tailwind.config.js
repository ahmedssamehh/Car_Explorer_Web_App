/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Sport Mode Theme
        sport: {
          primary: '#FF0000',
          secondary: '#000000',
          accent: '#8B0000',
          text: '#FFFFFF',
        },
        // Eco Mode Theme
        eco: {
          primary: '#22C55E',
          secondary: '#FFFFFF',
          accent: '#16A34A',
          text: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        // F1 Car Animation
        'f1-run': {
          '0%': { 
            transform: 'translateX(-100px) scale(0)',
            opacity: '0',
          },
          '30%': { 
            opacity: '1',
            transform: 'translateX(0px) scale(1)',
          },
          '70%': { 
            opacity: '1',
            transform: 'translateX(100px) scale(1)',
          },
          '100%': { 
            transform: 'translateX(200px) scale(0)',
            opacity: '0',
          },
        },
        // Red motion trail for F1
        'trail-fade': {
          '0%': { 
            width: '0%',
            opacity: '0.8',
          },
          '50%': { 
            width: '100%',
            opacity: '0.6',
          },
          '100%': { 
            width: '100%',
            opacity: '0',
          },
        },
        // Glow pulse effect
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 0, 0, 0.8)',
          },
        },
        // Fade in animation
        'fade-in': {
          '0%': { 
            opacity: '0',
          },
          '100%': { 
            opacity: '1',
          },
        },
        // Slide up animation
        'slide-up': {
          '0%': { 
            transform: 'translateY(30px)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        // Scale in animation
        'scale-in': {
          '0%': { 
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      animation: {
        'f1-run': 'f1-run 0.8s ease-out forwards',
        'trail-fade': 'trail-fade 0.8s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

