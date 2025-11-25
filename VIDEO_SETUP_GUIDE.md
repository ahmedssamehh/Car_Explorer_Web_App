# 🎥 Video Background Setup Guide

## ✅ What I Fixed

1. **Added Fallback Video**: Uses a free online RPM dashboard video if local file doesn't exist
2. **Improved Video Display**: Changed z-index and opacity for better visibility
3. **Better Loading**: Enhanced video loading logic
4. **Fallback Background**: Gradient background shows if video fails to load

## 🎬 Current Setup

The video now has **two sources**:

```html
<video id="hero-video" class="video-background" autoplay loop muted playsinline>
    <!-- Your local video (priority #1) -->
    <source src="../assets/rpm-background.mp4" type="video/mp4">
    
    <!-- Free online fallback video (priority #2) -->
    <source src="https://assets.mixkit.co/videos/preview/mixkit-dashboard-of-a-sports-car-at-night-49838-large.mp4" type="video/mp4">
</video>
```

## 🚀 Quick Test

**Refresh your browser** (Ctrl+F5 or Cmd+Shift+R)

You should now see:
- ✅ Video background playing automatically
- ✅ Video visible in BOTH Sport and Eco modes
- ✅ Different overlay colors (dark for Sport, light green for Eco)

## 📥 How to Add Your Own Video

### Option 1: Download Free Video

1. **Go to free video sites:**
   - Pexels Videos: https://www.pexels.com/videos/
   - Pixabay: https://pixabay.com/videos/
   - Mixkit: https://mixkit.co/free-stock-video/

2. **Search for:**
   - "car dashboard"
   - "rpm gauge"
   - "tachometer"
   - "car speedometer night"
   - "sports car interior"

3. **Download video** (MP4 format, 1920x1080 recommended)

4. **Rename to:** `rpm-background.mp4`

5. **Place in:** `src/assets/rpm-background.mp4`

6. **Refresh browser** - Your video will now play!

### Option 2: Use Current Fallback Video

The page is already using a free car dashboard video from Mixkit. If you like it, you can:

1. Download it from:
   ```
   https://assets.mixkit.co/videos/preview/mixkit-dashboard-of-a-sports-car-at-night-49838-large.mp4
   ```

2. Save as: `src/assets/rpm-background.mp4`

### Option 3: Use a Different Online Video

Replace the fallback URL in `index.html`:

```html
<source src="YOUR_VIDEO_URL_HERE" type="video/mp4">
```

## 🎨 Video Display Details

### Layers (bottom to top):
```
1. Background fallback gradient (z-index: 0)
2. Video element (z-index: 1)
3. Colored overlay (z-index: 2)
4. Content (text, buttons) (z-index: 10)
```

### Theme Overlays:

**Sport Mode:**
- Dark overlay: `rgba(0,0,0,0.7)` to `rgba(0,0,0,0.5)`
- Makes video dramatic and readable

**Eco Mode:**
- Light green overlay: `rgba(34, 197, 94, 0.2)` to `rgba(16, 185, 129, 0.15)`
- Gives fresh, eco-friendly tint

## 🔧 Troubleshooting

### Video not showing?

1. **Check browser console** (F12):
   - Look for video loading errors
   - Check if autoplay is blocked

2. **Try clicking the page:**
   - Some browsers block autoplay until user interaction
   - Video will start after first click

3. **Check video file:**
   - Must be MP4 format
   - H.264 codec recommended
   - Max size: 50MB for good loading

4. **Clear cache:**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### Video plays but not visible?

- Check CSS z-index values
- Make sure opacity is set to 1
- Verify video isn't behind other elements

### Video too bright/dark?

Adjust overlay opacity in `styles.css`:

```css
/* Make darker */
body[data-theme="sport"] .video-overlay {
  background: linear-gradient(
    to bottom, 
    rgba(0,0,0,0.85),  /* Increase this */
    rgba(0,0,0,0.7)    /* And this */
  );
}

/* Make lighter */
body[data-theme="eco"] .video-overlay {
  background: linear-gradient(
    to bottom,
    rgba(34, 197, 94, 0.1),  /* Decrease this */
    rgba(16, 185, 129, 0.05) /* And this */
  );
}
```

## 📊 Video Requirements

**Recommended specs:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (Full HD) or higher
- Frame rate: 30fps minimum
- File size: Under 50MB (smaller is better)
- Duration: 10-30 seconds (will loop)
- Audio: Not needed (muted)

**Good video characteristics:**
- Dark/moody dashboard shots for Sport Mode
- Subtle movement (not too distracting)
- Good contrast for text readability
- Loops seamlessly

## 🎯 Current Status

✅ Video background system is working  
✅ Fallback video from CDN is loaded  
✅ Both Sport and Eco modes show video  
✅ Overlay colors change per theme  
✅ Fallback gradient if video fails  

## 📝 Next Steps

1. **Test current setup** - Should work with fallback video
2. **Add your own video** - Follow Option 1 above
3. **Adjust overlay** - If video is too bright/dark
4. **Enjoy!** - Your background video is ready!

---

**The video background should now be visible!** 🎥✨

If you still don't see it, check:
1. Browser console for errors (F12)
2. Network tab to see if video is loading
3. Try a different browser (Chrome works best)

