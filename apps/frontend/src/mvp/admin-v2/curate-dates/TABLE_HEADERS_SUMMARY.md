# Curate Dates - Table Headers Summary

## Overview
All tables and major components in the curate-dates feature now have proper headers for better user context and navigation.

## Components with Headers

### 1. SearchableTable (User Selection)
- **Title**: "Select User"
- **Subtitle**: "Choose a user to find compatible matches"
- **Location**: Left column of the main grid
- **Purpose**: Helps admins understand they need to select a user first

### 2. SuggestedMatchesTable
- **Title**: "Suggested Matches"
- **Location**: Right column, appears after user selection
- **Purpose**: Shows compatible matches for the selected user
- **Features**: Includes a filters button to refine matches

### 3. SlotSelector
- **Title**: "Available Time Slots"
- **Location**: Bottom section, appears after match selection
- **Purpose**: Shows available time slots for both online and offline dates
- **Features**: Displays count badges for online/offline slots

### 4. CurationSummary
- **Title**: "Date Curation Summary"
- **Location**: Bottom right, appears alongside SlotSelector
- **Purpose**: Shows complete summary before creating the date
- **Features**: Validates all requirements before enabling date creation

## Implementation Details

### SearchableTable Enhancement
Added optional `title` and `subtitle` props to make the component more reusable:

```typescript
interface SearchableTableProps<T> {
  title?: string;
  subtitle?: string;
  // ... other props
}
```

The title section renders conditionally:
```tsx
{(title || subtitle) && (
  <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
    {title && <Text fontSize="lg" fontWeight="semibold">{title}</Text>}
    {subtitle && <Text fontSize="sm" color="gray.500">{subtitle}</Text>}
  </Box>
)}
```

## Visual Hierarchy
1. **Main Header**: "Curate Dates" (page level)
2. **Section Headers**: Each component has its own contextual header
3. **Consistent Styling**: All headers use similar font sizes and weights
4. **Clear Separation**: Headers are visually separated with borders

## Benefits
- Better user orientation and workflow understanding
- Clear visual hierarchy
- Consistent design patterns across components
- Improved accessibility with proper heading structure