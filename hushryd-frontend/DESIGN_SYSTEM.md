# HushRyd Design System

Inspired by BlaBlaCar's clean, modern aesthetic with unique color codes and proper alignments.

## 🎨 Color Palette

### Primary Colors (BlaBlaCar-inspired)
```
Primary Blue:    #00AFF5  // Main brand color, CTAs, links
Secondary Blue:  #084F8D  // Darker blue for depth
Accent Orange:   #FF8C00  // Highlights and notifications
Success Green:   #00B369  // Confirmations, success states
Error Red:       #E63946  // Errors, warnings
```

### Neutral Colors
```
Text Primary:    #2E3135  // Main text
Text Secondary:  #6C7680  // Secondary text
Text Tertiary:   #9CA7B0  // Placeholder, disabled text
Border:          #E8ECED  // Dividers, card borders
Background:      #FFFFFF  // Main background
Card BG:         #F7F9FA  // Card backgrounds
Light Gray:      #F7F9FA  // Subtle backgrounds
Medium Gray:     #E8ECED  // Borders, dividers
```

### Gradients
```
Primary Gradient:   ['#00D4FF', '#00AFF5', '#0090D9']
Secondary Gradient: ['#0A5C8E', '#084F8D', '#06428B']
```

## 📏 Spacing System

```typescript
xs:   4px   // Tight spacing
sm:   8px   // Small spacing
md:   12px  // Medium spacing
lg:   16px  // Large spacing (most common)
xl:   20px  // Extra large
xxl:  24px  // 2X large
xxxl: 32px  // 3X large
huge: 48px  // Huge spacing
```

## 🔤 Typography

### Font Sizes
```
xs:   11px  // Captions, labels
sm:   13px  // Small text
md:   15px  // Body text
lg:   17px  // Emphasized text
xl:   20px  // Subheadings
xxl:  24px  // Section titles
xxxl: 32px  // Page titles
huge: 40px  // Hero text
```

### Font Weights
```
Regular:  400
Medium:   500
Semibold: 600
Bold:     700
Extrabold: 800
```

## 🎯 Border Radius

```
sm:    8px   // Small elements
md:    12px  // Cards, buttons
lg:    16px  // Large cards
xl:    20px  // Hero sections
round: 999px // Badges, pills
```

## 🌑 Shadows

### Small Shadow
```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
}
```

### Medium Shadow
```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 4,
}
```

### Large Shadow
```typescript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 16,
  elevation: 8,
}
```

## 🧩 Components

### Button Variants

**Primary Button**
- Gradient background: `['#00D4FF', '#00AFF5', '#0090D9']`
- White text
- Medium shadow
- Border radius: 12px

**Secondary Button**
- Gradient background: `['#0A5C8E', '#084F8D']`
- White text
- Medium shadow
- Border radius: 12px

**Outline Button**
- Transparent background
- 2px border with primary color
- Primary color text
- Border radius: 12px

**Ghost Button**
- Transparent background
- No border
- Primary color text

### Cards

**Standard Card**
- Background: White (#FFFFFF)
- Border: 1px solid #E8ECED
- Border radius: 16px
- Padding: 16px
- Small shadow

**Elevated Card**
- Background: White (#FFFFFF)
- Border radius: 16px
- Padding: 16px
- Medium shadow
- No border

### Input Fields

- Background: rgba(0,0,0,0.02) // Light mode
- Background: rgba(255,255,255,0.05) // Dark mode
- Border radius: 12px
- Padding: 16px
- Min height: 52px
- Focus state: 2px primary border

### Ride Cards (Unique Design)

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Time & Date          [Badge]        │
├─────────────────────────────────────┤
│ ● From City                         │
│ │ Address                           │
│ │ Duration • Distance               │
│ ● To City                           │
│   Address                           │
├─────────────────────────────────────┤
│ 👤 Driver   Rating    ₹Price        │
│    Name     ⭐4.8     Seats          │
└─────────────────────────────────────┘
```

**Visual Elements:**
- Dot indicators for route (Blue start, Red end)
- Vertical line connecting dots
- Clear hierarchy with font sizes
- Price emphasized in primary blue
- Avatar with rating

## 📱 Responsive Design

### Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Layout Patterns

**Hero Section**
- Full width gradient background
- Centered content
- Large hero text (40px)
- Subtitle (17px)
- Padding: 48px vertical, 20px horizontal

**Search Card**
- Elevated above hero with negative margin
- Border radius: 20px
- Large shadow for depth
- White background

**Grid System**
- 2-column grid on mobile for popular routes
- Consistent 12-16px gap between items
- Cards stretch to fill available space

## 🎭 Animations

### Hover States
- Opacity: 0.7 on press
- Smooth transitions (0.2s ease)

### Active States
- Scale: 0.98 on press
- Immediate feedback

### Loading States
- Spinner: Primary color
- Opacity: 0.5 for disabled

## 📐 Alignment Principles

### Vertical Rhythm
- Consistent spacing between sections: 16-24px
- Heading to content: 12-16px
- Content to content: 8-12px

### Horizontal Alignment
- Content padding: 16-20px from edges
- Text left-aligned for readability
- Prices and actions right-aligned
- Center-align for empty states

### Visual Hierarchy
1. **Primary** - Hero text, prices, CTAs
2. **Secondary** - Body text, descriptions
3. **Tertiary** - Metadata, timestamps, labels

## 🎨 BlaBlaCar-Specific Elements

### Route Visualization
- Colored dots (Blue → Red)
- Connecting line
- Clear start/end differentiation

### Badges
- Rounded pills for ride types
- Verification badges with checkmarks
- Role indicators

### Trust Elements
- Star ratings prominently displayed
- Verification badges
- Review counts
- Member since dates

## 🔧 Usage Examples

### Applying Design System

```typescript
import { Spacing, BorderRadius, FontSizes, Shadows } from '@/constants/Design';
import Colors from '@/constants/Colors';

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
});
```

## 📊 Component Checklist

✅ **Completed Components:**
- Button (with gradients)
- Input (with icons)
- RideCard (unique design)
- SearchBar (floating)
- Profile cards
- Review cards
- Stats display
- Action buttons

## 🚀 Best Practices

1. **Always use design system constants** - Never hardcode values
2. **Maintain consistent spacing** - Use Spacing values
3. **Apply appropriate shadows** - Match depth to importance
4. **Use semantic colors** - primary for actions, success for confirmations
5. **Respect vertical rhythm** - Consistent spacing creates harmony
6. **Mobile-first approach** - Design for small screens first
7. **Accessibility** - Maintain contrast ratios, touch targets 44x44px min

---

**This design system ensures a cohesive, modern, and BlaBlaCar-inspired experience across the entire HushRyd app! 🎨**

