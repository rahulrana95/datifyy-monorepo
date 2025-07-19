# Table Consistency Fixes for Curate Dates

## Issues Fixed

### 1. Table Width Shifts During Loading
- **Problem**: Table width changed when loader appeared/disappeared
- **Solution**: 
  - Set table to use full width (`minW="100%"`)
  - Container uses flex layout to maintain consistent dimensions
  - Added `h="100%"` and `display="flex"` to table wrapper

### 2. Table Height Changes
- **Problem**: Table height varied based on number of rows shown
- **Solution**:
  - Created `TableWrapper` component to enforce consistent height
  - Added empty rows to fill space when data is less than page size
  - Each row has fixed height of 52px

### 3. Loading State Layout
- **Problem**: Single spinner caused table collapse
- **Solution**:
  - Show skeleton rows during loading (same number as page size)
  - Display spinner in center cell only
  - Maintain row structure even when loading

## Implementation Details

### TableWrapper Component
```typescript
const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  pageSize = 10,
  hasHeader = true,
  hasFooter = true,
  ...props
}) => {
  // Calculate fixed height based on:
  // - Header: 120px (title + search)
  // - Table header: 40px
  // - Rows: 52px * pageSize
  // - Footer: 68px (pagination)
  // - Padding: 32px
  
  const minHeight = headerHeight + tableHeaderHeight + (rowHeight * pageSize) + footerHeight + paddingHeight;
  
  return (
    <Box
      minH={`${minHeight}px`}
      maxH={`${minHeight}px`}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      {...props}
    >
      {children}
    </Box>
  );
};
```

### Empty Row Filling
```typescript
{/* Fill empty rows to maintain consistent height */}
{sortedData.length < pageSize && Array.from({ length: pageSize - sortedData.length }).map((_, index) => (
  <Tr key={`empty-${index}`} h="52px">
    {columns.map((column) => (
      <Td key={String(column.key)} borderColor="gray.100">&nbsp;</Td>
    ))}
  </Tr>
))}
```

### Loading State with Skeleton Rows
```typescript
{isLoading ? (
  <>
    {Array.from({ length: pageSize }).map((_, index) => (
      <Tr key={`loading-${index}`} h="52px">
        {columns.map((column, colIndex) => (
          <Td key={String(column.key)} borderColor="gray.100">
            {/* Show spinner only in center cell */}
            {index === Math.floor(pageSize / 2) && colIndex === Math.floor(columns.length / 2) ? (
              <Center>
                <Spinner size="sm" color="brand.500" />
              </Center>
            ) : (
              <Box>&nbsp;</Box>
            )}
          </Td>
        ))}
      </Tr>
    ))}
  </>
)
```

## Benefits
- No layout shifts during loading/data changes
- Consistent table dimensions regardless of content
- Better visual stability and user experience
- Predictable scroll behavior
- Professional appearance with skeleton loading