# Animated Multi-Step Calculator

A clean, professional multi-step form for the renovation cost calculator with animated house building visualization and smooth transitions.

## 🎨 Features

### 1. **Animated House Building Visualization** 🏠
- Progressive house construction as users complete steps
- SVG-based animation showing:
  - Foundation (Step 1)
  - Main structure (Step 2)
  - Roof (Step 3)
  - Windows (Step 4)
  - Door (Step 5)
  - Decorative details & landscaping (Step 6)
- Clean, theme-aware colors using CSS variables

### 2. **Clean Progress Indicators**
- Smooth animated progress bar
- Step circles with contextual icons for each stage
- Checkmark on completed steps
- Ring highlight on current step
- Default theme colors for consistency

### 3. **Smooth Step Transitions**
- Slide and fade animations between steps
- Direction-aware transitions (forward/backward)
- Spring physics for natural feel
- Prevents jarring content changes

### 4. **Enhanced Button Animations**
- Subtle scale on hover and tap
- Shine effect on hover
- Spring physics transitions
- Disabled state handling

### 5. **Professional Result Cards**
- Clean card layout
- Highlighted "average" estimate with border
- Clear pricing hierarchy
- Consistent with theme

## 📁 Component Structure

```
components/calculator/
├── animated-house-stepper.tsx      # Main stepper with house visualization
├── animated-step-content.tsx       # Wrapper for step content transitions
├── animated-button.tsx             # Enhanced button with animations
└── cost-calculator.tsx             # Main calculator (updated)
```

## 🎯 User Experience Benefits

1. **Visual Progress**: Users see their progress through house building metaphor
2. **Engagement**: Smooth animations keep users interested without being distracting
3. **Feedback**: Clear indication of current step and completion
4. **Professional**: Clean design with subtle animations feels polished
5. **Consistent**: Uses theme colors for seamless integration
6. **Responsive**: All animations respect user motion preferences

## 🔧 Technical Details

### Technologies Used
- **Framer Motion**: For all animations and transitions
- **SVG**: For scalable house visualization
- **Spring Physics**: For natural-feeling animations
- **CSS Transitions**: For hover effects

### Performance Considerations
- Hardware-accelerated transforms
- Conditional rendering of animations
- Optimized SVG rendering
- Minimal re-renders with React hooks

### Accessibility
- Respects `prefers-reduced-motion` for users who need it
- Keyboard navigation maintained
- Screen reader friendly
- No animation-dependent functionality

## 🎭 Animation Parameters

### House Building
- Duration: 0.4-0.6s per element
- Easing: easeOut for natural building
- Stagger: 0.2s between elements

### Step Transitions
- Spring stiffness: 300
- Spring damping: 30
- Opacity duration: 0.2s

### Progress Bar
- Duration: 0.5s
- Easing: easeInOut
- Uses theme primary color

### Buttons
- Hover scale: 1.02
- Tap scale: 0.98
- Spring stiffness: 400
- Spring damping: 17

## 🎨 Customization

To customize animations, modify the parameters in:
- `animated-house-stepper.tsx` for house building and progress indicators
- `animated-step-content.tsx` for step content transitions
- `animated-button.tsx` for button hover and tap effects

## 📱 Responsive Design

All animations are responsive and work on:
- Desktop (full experience)
- Tablet (optimized animations)
- Mobile (touch-friendly with appropriate scaling)

## 🚀 Future Enhancements

Potential improvements:
- [ ] Additional house styles (modern, traditional, etc.)
- [ ] More detailed house elements (windows grids, door handle, etc.)
- [ ] Custom animation timing controls
- [ ] Alternative building animations (apartment, office, etc.)
- [ ] Progress save/restore functionality

