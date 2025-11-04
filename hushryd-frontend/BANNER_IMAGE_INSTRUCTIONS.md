# Banner Image Setup Instructions

## 📸 **How to Add Your Banner Image**

### **Step 1: Prepare Your Image**
1. Save your coastal road banner image as `banner.png`
2. Recommended dimensions: **1200x400 pixels** (or similar aspect ratio)
3. File format: **PNG** (preferred) or **JPG**
4. File size: Keep under **2MB** for optimal performance

### **Step 2: Replace the Placeholder**
1. Navigate to: `assets/images/` folder
2. Replace the current `banner.png` file with your actual banner image
3. Keep the same filename: `banner.png`

### **Step 3: Verify the Setup**
The HeroBanner component is now configured to:
- ✅ Display your banner image as background
- ✅ Overlay text on top of the image
- ✅ Maintain responsive design
- ✅ Work on all screen sizes

## 🎨 **Current Banner Configuration**

```typescript
// Banner displays your image with text overlay
<Image 
  source={require('../assets/images/banner.png')} 
  style={styles.bannerImage}
  resizeMode="cover"
/>
```

## 📱 **What You'll See**

```
┌─────────────────────────────────────────┐
│  🖼️ Your Banner Image (Background)      │
│                                         │
│     ┌─────────────────────────────┐    │
│     │ Your pick of rides          │    │
│     │ at low prices               │    │
│     │                             │    │
│     │ Travel across AP & Telangana│    │
│     └─────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## ✅ **Ready to Use**

Once you replace the `banner.png` file with your actual banner image:
1. The application will automatically display your banner
2. Text will overlay on top of your image
3. The banner will work on both home screen and search results
4. No code changes needed - just replace the image file!

## 🚀 **Next Steps**

1. **Save your banner image** as `assets/images/banner.png`
2. **Start the application** - your banner will appear automatically
3. **Customize text** if needed by editing the HeroBanner component

Your beautiful coastal road banner will now be displayed perfectly in the HushRyd application! 🎉✨
