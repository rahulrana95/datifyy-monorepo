# Button Width-to-Height Ratio Fixes

## Overview
Fixed button proportions to have better width-to-height ratios across all sizes.

## Changes Made

### 1. Button Heights (Fixed)
- **xs**: 28px (h-7) - Previously 32px
- **sm**: 32px (h-8) - Previously 36px  
- **md**: 40px (h-10) - Previously 44px
- **lg**: 48px (h-12) - Previously 48px (unchanged)
- **xl**: 56px (h-14) - Previously 56px (unchanged)

### 2. Padding Adjustments
```typescript
// Before vs After
xs: { px: 3, py: 2 }    →  { px: 2.5, py: 1 }
sm: { px: 4, py: 2.5 }  →  { px: 3, py: 1.5 }
md: { px: 6, py: 3 }    →  { px: 4, py: 2 }
lg: { px: 8, py: 4 }    →  { px: 6, py: 2.5 }
xl: { px: 10, py: 5 }   →  { px: 8, py: 3 }
```

### 3. Visual Improvements
- Changed `borderRadius` from `xl` to `lg` for better balance
- Updated font weight from `semibold` to `medium` for base style
- Reduced outline border from 2px to 1px
- Added proper flex display and icon spacing

## Buttons in Curate-Dates Feature

### 1. Filter Button (SuggestedMatchesTable)
```tsx
<Button
  leftIcon={<FiFilter />}
  size="sm"
  variant="outline"
  onClick={onToggle}
>
  Filters
</Button>
```
- **Size**: sm (32px height)
- **Better ratio** with reduced padding

### 2. View Slots Button (SuggestedMatchesTable)
```tsx
<Button
  size="xs"
  colorScheme="brand"
  onClick={...}
>
  View Slots
</Button>
```
- **Size**: xs (28px height)
- **Compact** for table rows

### 3. Create Date Button (CurationSummary)
```tsx
<Button
  colorScheme="brand"
  size="lg"
  leftIcon={<FiSend />}
>
  Create Date & Send Invites
</Button>
```
- **Size**: lg (48px height)
- **Primary action** with good proportions

### 4. Modal Buttons
```tsx
<Button variant="ghost" mr={3}>Cancel</Button>
<Button colorScheme="brand">Confirm & Send Invites</Button>
```
- **Default size**: md (40px height)
- **Better spacing** in modal footer

## Benefits
1. **Better Proportions**: Buttons no longer look too tall for their width
2. **Consistent Sizing**: All buttons follow a predictable scale
3. **Improved Touch Targets**: Still meet accessibility requirements
4. **Icon Alignment**: Icons properly centered with text
5. **Visual Balance**: Better overall appearance in UI

## Testing
To see the improvements:
1. Check the "Filters" button - should look more balanced
2. "View Slots" buttons in table - compact but readable
3. "Create Date" button - prominent but proportional
4. Modal buttons - properly spaced and sized