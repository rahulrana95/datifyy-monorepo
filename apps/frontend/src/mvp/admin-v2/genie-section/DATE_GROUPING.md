# Date Grouping Feature - Genie Section

## Overview
The Genie Section now displays dates grouped by date with special labels for "Today", "Tomorrow", and "Yesterday". Other dates are shown with their full date format like "Monday, 12 July 2022".

## Implementation

### GroupedDatesList Component
A new component that automatically groups dates by their scheduled date and displays them in organized sections.

### Features
1. **Smart Date Labels**:
   - `Today` - For dates scheduled today
   - `Tomorrow` - For dates scheduled tomorrow
   - `Yesterday` - For dates that were yesterday
   - `Monday, 12 July 2022` - Full date format for other dates

2. **Sorted Display**:
   - Groups are sorted chronologically
   - Today always appears first
   - Tomorrow appears second
   - Then dates in chronological order

3. **Visual Hierarchy**:
   - Each date group has a header showing the date label
   - Count of dates in each group (e.g., "Today (3 dates)")
   - Dividers between date groups for clarity

4. **Responsive Grid**:
   - Date cards within each group maintain the same responsive grid layout
   - 1 column on mobile, 2 on tablet, 3 on desktop

## Usage
The component is used in all three tabs:
- **Upcoming Dates**: Shows future dates grouped by date
- **Ongoing Dates**: Shows today's ongoing dates
- **Past Dates**: Shows completed/cancelled dates grouped by date

## Example Display
```
Today (3 dates)
[Date Card 1] [Date Card 2] [Date Card 3]

Tomorrow (2 dates)
[Date Card 4] [Date Card 5]

Monday, 15 January 2024 (1 date)
[Date Card 6]

Wednesday, 17 January 2024 (2 dates)
[Date Card 7] [Date Card 8]
```

## Benefits
1. **Better Organization**: Users can quickly find dates by when they're scheduled
2. **Improved Scanning**: Grouped layout makes it easier to review multiple dates
3. **Time Context**: "Today" and "Tomorrow" provide immediate temporal context
4. **Scalability**: Works well with many dates across different days

## Technical Details
- Uses `date-fns` library for date formatting and comparison
- Implements efficient grouping algorithm
- Maintains existing card functionality (view details, reschedule, send reminder)
- Preserves responsive design patterns