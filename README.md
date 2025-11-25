# 🏎️ Car Explorer - Premium Landing Page

A premium, interactive landing page with Sport Mode and Eco Mode themes, F1-style animations, and a fullscreen video background.

## ✨ Features Implemented

### 🎨 Main Page (index.html)
- ✅ Large responsive hero headline with gradient text
- ✅ Professional subheadline with balanced spacing
- ✅ Two premium CTA buttons with F1 hover animations
- ✅ Fullscreen RPM video background (Sport Mode only)
- ✅ Dark gradient overlay with blur effect
- ✅ Smooth fade-in animations

### 🎚️ Theme System
- ✅ **Sport Mode**: Red & black theme with RPM video background
- ✅ **Eco Mode**: Green & white theme with gradient background
- ✅ Theme state saved in localStorage
- ✅ Smooth transitions between themes
- ✅ Red glow accents and aggressive animations in Sport Mode

### 🍃 Navigation Bar
- ✅ Ferrari logo integration
- ✅ Menu links: Home, Browse Cars, Favorites, Compare
- ✅ Theme toggle switch (Eco ↔ Sport)
- ✅ Transparent by default, blurred when scrolling
- ✅ Smooth scroll animations

### 🏎️ F1 Button Animation
- ✅ F1 car SVG animates from left to right on hover
- ✅ Red motion trail effect
- ✅ 0.8s animation duration
- ✅ Reusable `.f1-hover-animation` CSS class

### ✨ Page Animations
- ✅ Hero text fade-in
- ✅ Buttons slide-up animation
- ✅ Background video fade-in
- ✅ Navbar blur on scroll
- ✅ Subtle parallax effect on mouse move

### 📱 Responsive Design
- ✅ Fully responsive across desktop, tablet, and mobile
- ✅ Fluid typography using Tailwind responsive classes
- ✅ Adaptive button layouts
- ✅ Mobile-optimized spacing

## 📂 Required Assets

Before running the project, you need to add these files to `/src/assets/`:

1. **Ferrari Logo**: `logo.png`
   - Recommended size: 200x60px (transparent PNG)
   - If missing, "FERRARI" text will display instead

2. **RPM Background Video**: `rpm-background.mp4`
   - Recommended: Car dashboard tachometer/RPM video
   - Resolution: 1920x1080 or higher
   - Format: MP4 (H.264 codec)
   - Only shows in Sport Mode

### Where to Get Assets:
- **Ferrari Logo**: Download from [Ferrari Official](https://www.ferrari.com) or use a royalty-free version
- **RPM Video**: Search for "car rpm dashboard video loop" on stock video sites

## 🚀 How to Run

### Option 1: Direct Open (Simple)
1. Open `src/pages/index.html` directly in your browser

### Option 2: With Tailwind Build (Recommended)
1. Install dependencies:
```bash
npm install
```

2. Build Tailwind CSS:
```bash
npm run build
```

3. Start a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Open `http://localhost:8000/src/pages/index.html`

## 🎯 How to Use

### Theme Switching
- Click the toggle switch in the navbar
- **Eco Mode**: Green/white theme, clean gradient background
- **Sport Mode**: Red/black theme, RPM video background with glow effects

### F1 Button Animation
- Hover over any primary button ("Browse Cars", "Compare Cars")
- Watch the F1 car race across the button with a red trail

### Parallax Effect
- Move your mouse across the hero section
- The content subtly follows your cursor

## 🎨 Custom Tailwind Configuration

The project uses custom Tailwind configuration with:
- Custom color themes (Sport & Eco)
- F1 animation keyframes
- Motion trail effects
- Glow pulse animations
- Responsive breakpoints

## 📁 File Structure

```
/project
  /src
    /assets
      logo.png (⚠️ ADD THIS)
      rpm-background.mp4 (⚠️ ADD THIS)
    /css
      styles.css (✅ Custom styles & animations)
    /js
      theme.js (✅ Theme switching logic)
    /pages
      index.html (✅ Main landing page)
  tailwind.config.js (✅ Tailwind configuration)
  package.json (✅ Dependencies)
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Theme switching and interactions
- **CSS Animations**: Custom keyframe animations
- **localStorage**: Theme persistence

## 🎭 Animation Details

### F1 Car Animation
- Duration: 0.8s
- Easing: ease-out
- Path: left (-100px) → right (200px)
- Includes scale and opacity transitions

### Red Motion Trail
- Synced with F1 car movement
- Fades out over 0.8s
- Delay: 0.1s after car starts

### Hero Animations
- Title: Fade-in (1s delay: 0.5s)
- Subtitle: Fade-in (1s delay: 0.8s)
- Buttons: Slide-up (0.8s delay: 1.1s)
- Video: Fade-in (1.5s delay: 0.3s)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🎨 Color Palette

### Sport Mode
- Primary: `#FF0000` (Ferrari Red)
- Secondary: `#000000` (Black)
- Accent: `#8B0000` (Dark Red)
- Text: `#FFFFFF` (White)

### Eco Mode
- Primary: `#22C55E` (Green)
- Secondary: `#FFFFFF` (White)
- Accent: `#16A34A` (Dark Green)
- Text: `#1F2937` (Gray)

## 🔧 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  sport: {
    primary: '#YOUR_COLOR',
    // ...
  }
}
```

### Modify Animations
Edit `src/css/styles.css`:
```css
.f1-hover-animation::before {
  animation: f1-run 0.8s ease-out forwards;
}
```

### Change Video
Replace `rpm-background.mp4` in `/src/assets/`

## 📝 Notes

- The page is optimized for modern browsers (Chrome, Firefox, Safari, Edge)
- Video autoplay works best on desktop; may require user interaction on mobile
- Theme preference persists across browser sessions
- All animations are GPU-accelerated for smooth performance

## 🎯 Next Steps

To complete the full Car Explorer app:
1. Build `cars.html` (Browse Cars page)
2. Build `details.html` (Car Details page)
3. Build `favorites.html` (Favorites page)
4. Build `compare.html` (Compare page)
5. Create `cars.json` with car data
6. Implement API, storage, and UI modules

---

**Built with ❤️ for premium automotive experiences**

