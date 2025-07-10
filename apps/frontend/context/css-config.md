# CSS Configuration & Design Tokens

## Color System

### Brand Colors
```css
--brand-50: #fef7f7;   /* Ultra light backgrounds */
--brand-100: #fce8e8;  /* Very light backgrounds */
--brand-200: #f8d5d5;  /* Light borders, disabled states */
--brand-300: #f2b3b3;  /* Secondary elements */
--brand-400: #ea8a8a;  /* Secondary buttons */
--brand-500: #e85d75;  /* Primary brand color */
--brand-600: #d14361;  /* Hover states */
--brand-700: #b8344d;  /* Pressed states */
--brand-800: #9c2a40;  /* Text on light backgrounds */
--brand-900: #842439;  /* High contrast text */
```

### Swipe Action Colors

#### Like Actions (Green)
```css
--swipe-like-50: #f0fdf4;
--swipe-like-100: #dcfce7;
--swipe-like-200: #bbf7d0;
--swipe-like-300: #86efac;
--swipe-like-400: #4ade80;
--swipe-like-500: #22c55e;  /* Main like green */
--swipe-like-600: #16a34a;
--swipe-like-700: #15803d;
--swipe-like-800: #166534;
--swipe-like-900: #14532d;
```

#### Pass/Nope Actions (Red)
```css
--swipe-nope-50: #fef2f2;
--swipe-nope-100: #fee2e2;
--swipe-nope-200: #fecaca;
--swipe-nope-300: #fca5a5;
--swipe-nope-400: #f87171;
--swipe-nope-500: #ef4444;  /* Main nope red */
--swipe-nope-600: #dc2626;
--swipe-nope-700: #b91c1c;
--swipe-nope-800: #991b1b;
--swipe-nope-900: #7f1d1d;
```

#### Super Like Actions (Blue)
```css
--swipe-superlike-50: #eff6ff;
--swipe-superlike-100: #dbeafe;
--swipe-superlike-200: #bfdbfe;
--swipe-superlike-300: #93c5fd;
--swipe-superlike-400: #60a5fa;
--swipe-superlike-500: #3b82f6;  /* Main super like blue */
--swipe-superlike-600: #2563eb;
--swipe-superlike-700: #1d4ed8;
--swipe-superlike-800: #1e40af;
--swipe-superlike-900: #1e3a8a;
```

#### Boost/Premium (Gold)
```css
--swipe-boost-50: #fffbeb;
--swipe-boost-100: #fef3c7;
--swipe-boost-200: #fde68a;
--swipe-boost-300: #fcd34d;
--swipe-boost-400: #fbbf24;
--swipe-boost-500: #f59e0b;  /* Main boost gold */
--swipe-boost-600: #d97706;
--swipe-boost-700: #b45309;
--swipe-boost-800: #92400e;
--swipe-boost-900: #78350f;
```

### Status Colors
```css
--status-online: #22c55e;
--status-away: #f59e0b;
--status-offline: #6b7280;
--status-busy: #ef4444;
--status-verified: #3b82f6;
--status-premium: #8b5cf6;
--status-new-user: #10b981;
```

### Semantic Colors
```css
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

### Gray Scale (Warm Tinted)
```css
--gray-50: #fafafa;
--gray-100: #f5f5f5;
--gray-200: #eeeeee;
--gray-300: #e0e0e0;
--gray-400: #bdbdbd;
--gray-500: #9e9e9e;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;
```

## Responsive Breakpoints

### Breakpoint Values
```css
--breakpoint-base: 0em;     /* 0px - Mobile first */
--breakpoint-sm: 30em;      /* 480px - Small mobile */
--breakpoint-md: 48em;      /* 768px - Tablet */
--breakpoint-lg: 62em;      /* 992px - Desktop */
--breakpoint-xl: 80em;      /* 1280px - Large desktop */
--breakpoint-2xl: 96em;     /* 1536px - Extra large */
```

### Media Queries
```css
@media (min-width: 30em) { /* sm */ }
@media (min-width: 48em) { /* md */ }
@media (min-width: 62em) { /* lg */ }
@media (min-width: 80em) { /* xl */ }
@media (min-width: 96em) { /* 2xl */ }
```

### Container Sizes
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
--container-7xl: 1280px;  /* Datifyy max width */
```

## Spacing System

### Spacing Scale (8px Grid)
```css
--space-px: 1px;
--space-0: 0;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px - Base unit */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
--space-9: 2.25rem;     /* 36px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-14: 3.5rem;     /* 56px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
--space-40: 10rem;      /* 160px */
--space-48: 12rem;      /* 192px */
--space-56: 14rem;      /* 224px */
--space-64: 16rem;      /* 256px */
--space-72: 18rem;      /* 288px */
--space-80: 20rem;      /* 320px */
--space-96: 24rem;      /* 384px */
```

## Border Radius

### Radius Scale
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Perfect circle */
```

### Component-Specific Radius
```css
--radius-button: var(--radius-xl);      /* 12px */
--radius-card: var(--radius-xl);        /* 12px */
--radius-modal: var(--radius-xl);       /* 12px */
--radius-profile-card: var(--radius-2xl); /* 16px */
--radius-input: var(--radius-lg);       /* 8px */
```

## Shadows

### Shadow Scale
```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

### Brand-Specific Shadows
```css
--shadow-brand: 0 4px 14px 0 rgba(232, 93, 117, 0.25);
--shadow-brand-lg: 0 10px 40px 0 rgba(232, 93, 117, 0.3);
--shadow-brand-xl: 0 20px 60px 0 rgba(232, 93, 117, 0.4);

--shadow-like: 0 4px 14px 0 rgba(34, 197, 94, 0.25);
--shadow-nope: 0 4px 14px 0 rgba(239, 68, 68, 0.25);
--shadow-superlike: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
--shadow-boost: 0 4px 14px 0 rgba(245, 158, 11, 0.25);

--shadow-premium: 0 8px 32px 0 rgba(139, 92, 246, 0.3);
--shadow-premium-hover: 0 12px 48px 0 rgba(139, 92, 246, 0.4);
```

### Focus Shadows
```css
--shadow-outline: 0 0 0 3px rgba(232, 93, 117, 0.3);
--shadow-outline-error: 0 0 0 3px rgba(239, 68, 68, 0.3);
--shadow-outline-success: 0 0 0 3px rgba(34, 197, 94, 0.3);
--shadow-outline-warning: 0 0 0 3px rgba(245, 158, 11, 0.3);
--shadow-outline-info: 0 0 0 3px rgba(59, 130, 246, 0.3);
```

## Typography Tokens

### Font Families
```css
--font-heading: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
--text-8xl: 6rem;      /* 96px */
--text-9xl: 8rem;      /* 128px */
```

### Font Weights
```css
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Letter Spacing
```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

## Gradients

### Brand Gradients
```css
--gradient-brand: linear-gradient(135deg, #e85d75 0%, #d14361 100%);
--gradient-brand-light: linear-gradient(135deg, #fef7f7 0%, #ffffff 100%);
--gradient-premium: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
--gradient-hero: linear-gradient(135deg, #fef7f7 0%, #fce8e8 50%, #f8d5d5 100%);
```

### Action Gradients
```css
--gradient-like: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
--gradient-nope: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8));
--gradient-superlike: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
```

## Z-Index Scale

```css
--z-hide: -1;
--z-auto: auto;
--z-base: 0;
--z-docked: 10;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-banner: 1200;
--z-overlay: 1300;
--z-modal: 1400;
--z-popover: 1500;
--z-skiplink: 1600;
--z-toast: 1700;
--z-tooltip: 1800;
```

## Transition & Animation

### Timing Functions
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-dating: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration
```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Dating App Animations
```css
--animation-heart-beat: heartBeat 1s ease-in-out;
--animation-bounce-in: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
--animation-fade-in: fadeIn 0.3s ease-in-out;
--animation-love-pulse: lovePulse 1.5s ease-in-out infinite;
--animation-float: float 3s ease-in-out infinite;
```

## Component Tokens

### Button Tokens
```css
--button-height-xs: 2rem;      /* 32px */
--button-height-sm: 2.25rem;   /* 36px */
--button-height-md: 2.75rem;   /* 44px */
--button-height-lg: 3rem;      /* 48px */
--button-height-xl: 3.5rem;    /* 56px */

--button-padding-xs: 0.75rem 1rem;
--button-padding-sm: 1rem 1.5rem;
--button-padding-md: 1.5rem 2rem;
--button-padding-lg: 2rem 2.5rem;
--button-padding-xl: 2.5rem 3rem;
```

### Card Tokens
```css
--card-padding-sm: 1rem;
--card-padding-md: 1.5rem;
--card-padding-lg: 2rem;

--card-radius: var(--radius-xl);
--card-shadow: var(--shadow-md);
--card-shadow-hover: var(--shadow-lg);
```

### Input Tokens
```css
--input-height-sm: 2.25rem;    /* 36px */
--input-height-md: 3rem;       /* 48px */
--input-height-lg: 3.5rem;     /* 56px */

--input-padding-sm: 0.5rem 0.75rem;
--input-padding-md: 0.75rem 1rem;
--input-padding-lg: 1rem 1.25rem;

--input-border-width: 2px;
--input-radius: var(--radius-lg);
```

## CSS Custom Properties Usage

### Example Implementation
```css
:root {
  /* Color tokens */
  --primary: var(--brand-500);
  --primary-hover: var(--brand-600);
  --primary-pressed: var(--brand-700);
  
  /* Component tokens */
  --button-primary-bg: var(--primary);
  --button-primary-hover: var(--primary-hover);
  --button-primary-text: white;
  
  /* Spacing tokens */
  --section-spacing: var(--space-16);
  --card-spacing: var(--space-6);
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: var(--gray-100);
    --bg-primary: var(--gray-900);
    --card-bg: var(--gray-800);
  }
}
```

### Component CSS
```css
.button-primary {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: var(--button-padding-md);
  border-radius: var(--radius-xl);
  transition: all var(--duration-200) var(--ease-in-out);
}

.button-primary:hover {
  background: var(--button-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```