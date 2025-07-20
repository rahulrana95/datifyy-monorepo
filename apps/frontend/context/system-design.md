# Datifyy Design System

## Overview

Datifyy is a premium dating app focused on meaningful connections. The design system emphasizes emotional design, trust signals, and mobile-first experiences with a romantic, modern aesthetic.

### Brand Identity
- **Name**: Datifyy
- **Tagline**: "Let's be serious about love"
- **Logo**: Heart symbol (💕) with pink gradient
- **Primary Color**: #e85d75 (brand.500)
- **Personality**: Serious about love, premium, trustworthy, emotional, modern

## Layout Rules

### Grid System
- **Base Unit**: 8px grid system for consistency
- **Container Max Width**: 7xl (1280px)
- **Responsive Breakpoints**:
  - `base`: 0px (mobile-first)
  - `sm`: 480px
  - `md`: 768px  
  - `lg`: 992px
  - `xl`: 1280px
  - `2xl`: 1536px

### Spacing Scale
```
px: 1px
0: 0
0.5: 2px
1: 4px
2: 8px (base unit)
3: 12px
4: 16px
6: 24px
8: 32px
12: 48px
16: 64px
20: 80px
```

### Safe Areas
- **Mobile Optimization**: Account for notches and home indicators
- **Touch Targets**: Minimum 44px for interactive elements
- **Safe Area Classes**: `.safe-top`, `.safe-bottom`, `.safe-left`, `.safe-right`

## Component Library

### Buttons

#### Variants
- **`love`**: Gradient love button with heart beat animation
- **`swipeLike`**: Circular green like button (56px)
- **`swipeNope`**: Circular red pass button (56px)  
- **`swipeSuperLike`**: Circular blue super like button (56px)
- **`boost`**: Circular gold boost button (56px)
- **`premium`**: Purple gradient with shimmer effect
- **`fab`**: Floating action button (64px)

#### Sizing
- **xs**: 32px min height
- **sm**: 36px min height
- **md**: 44px min height (default)
- **lg**: 48px min height
- **xl**: 56px min height

### Cards

#### Variants
- **`profile`**: Swipeable profile cards with 2xl border radius
- **`match`**: Match celebration cards with brand gradient background
- **`floating`**: Elevated cards with strong shadows
- **`premium`**: Purple gradient cards for premium features
- **`interactive`**: Clickable cards with hover effects

#### Sizing
- **sm**: 1rem padding
- **md**: 1.5rem padding (default)
- **lg**: 2rem padding

### Inputs

#### Variants
- **`outline`**: Standard outlined inputs with 2px borders
- **`filled`**: Gray background inputs
- **`chat`**: Rounded chat input style
- **`search`**: Full rounded search with icon space
- **`premium`**: Gradient border effect

#### States
- **Focus**: brand.500 border with glow effect
- **Error**: error.500 border with validation message
- **Success**: success.500 border

### Avatars

#### Variants
- **`profile`**: Brand-styled with border and hover effects
- **`online`**: Green status indicator
- **`verified`**: Blue checkmark overlay
- **`premium`**: Purple gradient with crown icon
- **`match`**: Heart indicator with animation

#### Sizes
- **xs**: 24px
- **sm**: 32px  
- **md**: 48px (default)
- **lg**: 64px
- **profile**: 80px
- **hero**: 160px

## Interaction Patterns

### Swipe Gestures
- **Right Swipe**: Like action with green overlay
- **Left Swipe**: Pass action with red overlay
- **Up Swipe**: Super like with blue overlay
- **Touch Action**: `pan-y pinch-zoom` for cards

### Animations
- **`.heart-beat`**: Pulsing animation for likes
- **`.bounce-in`**: Entrance animation for modals
- **`.fade-in`**: Smooth content transitions
- **`.love-pulse`**: Romantic pulsing effect
- **`.float`**: Floating animation for FABs

### Hover Effects
- **Cards**: `translateY(-2px)` with enhanced shadow
- **Buttons**: `translateY(-1px)` with color transition
- **Interactive Elements**: Scale and shadow changes

## Accessibility

### Focus Management
- **Outline**: None on focus, custom focus rings
- **Focus Ring**: `0 0 0 3px rgba(232, 93, 117, 0.3)`
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles

### Color Contrast
- **Text on Light**: Minimum 4.5:1 contrast ratio
- **Text on Brand**: White text on brand colors
- **Interactive States**: Clear visual feedback

### Touch Accessibility  
- **Minimum Touch Target**: 44px
- **Spacing**: Adequate spacing between touch targets
- **Gestures**: Alternative methods for swipe actions

## Mobile-First Principles

### Progressive Enhancement
- Start with mobile design
- Enhance for larger screens
- Touch-friendly interactions

### Performance
- Lazy loading for images
- Optimized animations (60fps)
- Efficient state management

### Offline Support
- Cache critical UI components
- Graceful degradation
- Queue user actions

## Component Usage Guidelines

### Profile Cards
```jsx
<Card variant="profile" className="swipe-card">
  <ProfileImage />
  <ProfileInfo />
  <SwipeActions />
</Card>
```

### Action Buttons
```jsx
<Button variant="swipeLike" className="heart-beat">
  <HeartIcon />
</Button>
```

### Status Indicators
```jsx
<Avatar variant="verified" size="profile">
  <UserImage />
</Avatar>
```

## Layer Styles

### Common Patterns
- **`card`**: White background, xl radius, medium shadow
- **`profileCard`**: Profile-specific styling with overflow hidden
- **`modalContent`**: Modal container styling
- **`floatingButton`**: FAB with brand colors and hover effects

## Dating App Specific Guidelines

### Emotional Design
- Use warm colors and gradients
- Smooth animations and transitions
- Heart and love iconography
- Celebration moments for matches

### Trust Signals
- Verification badges and indicators
- Safety features prominence
- Clear privacy controls
- Professional, premium feel

### Conversion Optimization
- Clear call-to-action buttons
- Emotional copy and messaging
- Social proof elements
- FOMO and premium features

### User Experience
- Progressive disclosure of information
- Gesture-based interactions
- Contextual feedback
- Celebration of positive actions