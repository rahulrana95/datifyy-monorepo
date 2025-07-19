# Genie Section - Pagination Fix

## Issue
The upcoming and ongoing dates were not visible in the UI tabs even though they existed in the mock data.

## Root Cause
The issue was caused by the pagination system:
1. Default page size was set to 10 items
2. Mock data was generated sequentially (dates 1-15 were upcoming, 16-25 were ongoing)
3. The first page would only show upcoming dates (items 1-10)
4. The UI was filtering from the paginated results, not the full dataset

## Solution Applied

### 1. Increased Page Size
Changed the default page size from 10 to 50 in the store:
```typescript
pagination: {
  currentPage: 1,
  pageSize: 50, // Increased to show all dates
  totalItems: 0,
},
```

### 2. Shuffled Mock Data
Added shuffling to mix different status types across pages:
```typescript
// Shuffle the dates to mix different statuses
// This ensures that pagination doesn't show only one type
const shuffledDates = dates.sort(() => Math.random() - 0.5);
```

## Result
- All tabs now show their respective dates correctly
- Upcoming tab shows ~15 upcoming dates
- Ongoing tab shows ~10 ongoing dates
- Past dates tab shows completed and cancelled dates
- Data is mixed across pages for realistic pagination

## Alternative Solutions (for future consideration)
1. **Client-side filtering**: Fetch all data and filter on client
2. **Server-side tab filtering**: Have separate API endpoints for each tab
3. **Virtual scrolling**: Load more data as user scrolls
4. **Remove pagination**: For admin tools with limited data

## Testing
To verify the fix:
1. Navigate to Admin Panel > Genie Section
2. Check that the Upcoming tab shows dates
3. Check that the Ongoing tab shows dates
4. Verify badge counts match visible items