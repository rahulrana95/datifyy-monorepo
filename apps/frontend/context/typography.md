# Typography System

## Font Stack

### Primary Font
```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Usage
- **Headings**: Inter for all heading levels
- **Body Text**: Inter for optimal readability
- **Monospace**: SF Mono, Monaco, Inconsolata, Roboto Mono for code

## Font Sizes

### Scale
```css
xs: 12px    /* Small captions, meta text */
sm: 14px    /* Secondary text, form labels */
md: 16px    /* Body text (default) */
lg: 18px    /* Large body text, subtitles */
xl: 20px    /* Small headings */
2xl: 24px   /* Medium headings */
3xl: 30px   /* Large headings */
4xl: 36px   /* Extra large headings */
5xl: 48px   /* Hero headings */
6xl: 60px   /* Display headings */
7xl: 72px   /* Large display */
8xl: 96px   /* Extra large display */
9xl: 128px  /* Massive display */
```

### Responsive Sizing
```jsx
// Hero text scales across devices
fontSize={['2xl', '3xl', '4xl']}  // mobile, tablet, desktop
```

## Font Weights

```css
thin: 100        /* Very light decorative text */
extraLight: 200  /* Light decorative text */
light: 300       /* Light body text */
normal: 400      /* Regular body text (default) */
medium: 500      /* Emphasis, secondary headings */
semiBold: 600    /* Button text, important labels */
bold: 700        /* Headings, strong emphasis */
extraBold: 800   /* Large headings */
black: 900       /* Display text, hero headings */
```

## Line Heights

```css
tight: 1.25     /* Headings, compact text */
snug: 1.375     /* Subheadings */
normal: 1.5     /* Body text (default) */
relaxed: 1.625  /* Comfortable reading */
loose: 2        /* Very comfortable, accessible */
```

## Letter Spacing

```css
tighter: -0.05em  /* Large headings */
tight: -0.025em   /* Medium headings */
normal: 0         /* Body text (default) */
wide: 0.025em     /* Button text, labels */
wider: 0.05em     /* Captions, meta text */
widest: 0.1em     /* All caps text */
```

## Text Styles

### Predefined Styles

#### Hero Text
```jsx
textStyle="hero"
// fontSize: ['2xl', '3xl', '4xl']
// fontWeight: 'black'
// lineHeight: 'tight'
// letterSpacing: 'tighter'
```

#### Headings
```jsx
// H1
textStyle="h1"
// fontSize: ['xl', '2xl', '3xl']
// fontWeight: 'bold'
// lineHeight: 'tight'

// H2  
textStyle="h2"
// fontSize: ['lg', 'xl', '2xl']
// fontWeight: 'bold'
// lineHeight: 'tight'

// H3
textStyle="h3"
// fontSize: ['md', 'lg', 'xl']
// fontWeight: 'semiBold'
// lineHeight: 'snug'
```

#### Body Text
```jsx
textStyle="body"
// fontSize: 'md'
// fontWeight: 'normal'
// lineHeight: 'normal'
```

#### Dating App Specific

##### Profile Name
```jsx
textStyle="profileName"
// fontSize: ['lg', 'xl']
// fontWeight: 'bold'
// lineHeight: 'tight'
```

##### Profile Bio
```jsx
textStyle="profileBio"
// fontSize: 'md'
// lineHeight: 'relaxed'
```

##### Button Text
```jsx
textStyle="buttonText"
// fontSize: 'md'
// fontWeight: 'semiBold'
// letterSpacing: 'wide'
```

##### Caption Text
```jsx
textStyle="caption"
// fontSize: 'xs'
// fontWeight: 'medium'
// textTransform: 'uppercase'
// letterSpacing: 'wider'
```

## Usage Guidelines

### Hierarchy

#### Information Architecture
1. **Hero/Display** (h1): Main page titles, hero sections
2. **Section Headers** (h2): Major content sections
3. **Subsection Headers** (h3): Content subsections
4. **Body Text**: Main content, descriptions
5. **Secondary Text**: Meta information, captions
6. **Small Text**: Fine print, disclaimers

#### Dating App Context
1. **Profile Names**: Bold, prominent
2. **Bio Text**: Readable, relaxed line height
3. **Match Count**: Large, celebratory
4. **Age/Location**: Secondary, subtle
5. **Interests**: Tags, medium weight
6. **Messages**: Conversational, clear

### Readability

#### Line Length
- **Optimal**: 45-75 characters per line
- **Maximum**: 85 characters for body text
- **Mobile**: Shorter lines acceptable (35-45 chars)

#### Spacing
- **Paragraph Spacing**: 1.5em between paragraphs
- **Section Spacing**: 2-3em between sections
- **List Spacing**: 0.5em between list items

### Accessibility

#### Contrast Requirements
- **Large Text** (18px+): 3:1 minimum contrast
- **Regular Text**: 4.5:1 minimum contrast
- **AA Standard**: Aim for 4.5:1 for all text
- **AAA Standard**: 7:1 for enhanced accessibility

#### Font Size Minimums
- **Mobile**: 16px minimum for body text
- **Desktop**: 14px minimum acceptable
- **Touch Targets**: 16px+ for interactive text

## Mobile Optimization

### Responsive Typography

#### Mobile-First Approach
```jsx
// Start with mobile, enhance for larger screens
<Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>
  Responsive text that scales appropriately
</Text>
```

#### Reading Experience
- **Mobile**: Larger font sizes for thumb navigation
- **Tablet**: Balanced sizing for reading
- **Desktop**: Optimized for distance viewing

### Touch Considerations
- **Link Spacing**: Adequate space between links
- **Button Text**: Large enough for easy tapping
- **Form Labels**: Clear and sufficiently sized

## Brand Voice

### Tone Characteristics
- **Warm**: Use softer, rounded typography styles
- **Premium**: Clean, sophisticated font weights
- **Trustworthy**: Consistent, professional typography
- **Emotional**: Expressive headings, comfortable body text
- **Modern**: Contemporary font stack and sizing

### Content-Specific Typography

#### Profile Content
- **Names**: Bold, trustworthy
- **Bio**: Personal, readable
- **Interests**: Friendly, approachable
- **Stats**: Clear, informative

#### Messaging
- **Chat Text**: Conversational sizing
- **Timestamps**: Subtle, unobtrusive
- **Status Text**: Clear state indication

#### Marketing Content
- **Headlines**: Bold, attention-grabbing
- **CTAs**: Action-oriented, prominent
- **Features**: Benefit-focused, scannable

## Implementation Examples

### Chakra UI Components

#### Custom Heading Variants
```jsx
<Heading variant="love">
  // Gradient text effect
  bgGradient="linear(135deg, brand.500, brand.700)"
  bgClip="text"
  fontWeight="extrabold"
</Heading>

<Heading variant="brand">
  // Brand colored heading
  color="brand.500"
</Heading>
```

#### Text Variants
```jsx
<Text variant="brand">Brand colored text</Text>
<Text variant="muted">Muted secondary text</Text>
<Text variant="subtle">Subtle supporting text</Text>
```

### CSS Classes

#### Utility Classes
```css
.gradient-text {
  background: linear-gradient(135deg, #e85d75, #d14361);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Performance Considerations

### Font Loading
- **Font Display**: `swap` for faster rendering
- **Preload**: Critical fonts in HTML head
- **Fallbacks**: System fonts for instant rendering

### Optimization
- **Font Subsetting**: Include only necessary characters
- **Variable Fonts**: Use when beneficial for file size
- **Caching**: Leverage browser font caching

## Maintenance

### Consistency Checks
- Regular audit of font usage across components
- Ensure compliance with accessibility standards
- Monitor performance impact of typography choices

### Future Enhancements
- Consider variable fonts for better responsiveness
- Evaluate new font features as browser support improves
- Continuous testing with real users for readability