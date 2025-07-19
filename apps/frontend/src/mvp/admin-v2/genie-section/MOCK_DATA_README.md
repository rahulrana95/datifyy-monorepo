# Genie Section Mock Data Integration

## Overview
The Genie Section uses a comprehensive mock data system that integrates with the application's feature flags to switch between mock and real API data.

## Architecture

### 1. Service Layer (`genieSectionService.ts`)
- Extends `BaseService` which handles the mock/real data switching
- Uses feature flag `featureFlags.useMockData` to determine data source
- When mock data is enabled, calls mock data functions
- When mock data is disabled, makes real API calls

### 2. Mock Data Generation (`mockGenieSectionData.ts`)
- `generateMockDates()`: Creates 50 sample dates with various statuses
- `mockLocations`: Pre-defined location data for offline dates
- `mockReminderTemplates`: Email/SMS templates for reminders
- Realistic user profiles with verification status

### 3. Store Integration (`genieSectionStore.ts`)
- Uses the service layer for all data operations
- Maintains consistent state management
- Handles loading states and error handling

## Usage

### Enable/Disable Mock Data

1. **Via Feature Flags Panel** (Development only):
   - Click the settings icon in the bottom right
   - Toggle "Use Mock Data" on/off
   - Page will reload automatically

2. **Via Environment Variable**:
   ```bash
   REACT_APP_USE_MOCK_DATA=true npm start  # Use mock data
   REACT_APP_USE_MOCK_DATA=false npm start # Use real API
   ```

3. **Via LocalStorage** (Runtime):
   ```javascript
   // In browser console
   localStorage.setItem('datifyy_feature_flags', JSON.stringify({ useMockData: true }));
   location.reload();
   ```

## Mock Data Features

### Generated Data Includes:
- 50 dates with random statuses (upcoming, ongoing, completed, cancelled, rescheduled)
- Realistic Indian names and cities
- Company/college information
- Verification status for each user
- Profile scores (60-100)
- Reminder status tracking
- Date feedback for completed dates

### API Endpoints Mocked:
- `GET /admin/genie/dates/{genieId}` - Fetch genie's dates
- `PUT /admin/genie/dates/{dateId}/status` - Update date status
- `PUT /admin/genie/dates/{dateId}/reschedule` - Reschedule date
- `GET /admin/genie/locations` - Search locations
- `GET /admin/genie/reminder-templates` - Get templates
- `POST /admin/genie/dates/{dateId}/send-reminder` - Send reminder
- `PUT /admin/genie/dates/{dateId}/notes` - Update notes

## Future Integration

When integrating with the real backend:

1. **Update Genie ID**:
   - Replace `MOCK_GENIE_ID` in `genieSectionService.ts` with actual genie ID from auth
   - Get genie name from auth store

2. **API Endpoints**:
   - Ensure backend API matches the endpoint structure
   - Update any parameter names if needed

3. **Data Types**:
   - Review `types/index.ts` for any backend-specific changes
   - Update verification status fields if needed

4. **Error Handling**:
   - Add specific error codes handling
   - Implement retry logic if needed

## Testing

To test the mock data system:

```bash
# Start with mock data
npm start

# Navigate to Admin Panel > Genie Section
# You should see 50 sample dates

# Test features:
# - Filter by status, mode, verification
# - Search users
# - Reschedule dates
# - Send reminders
# - Update notes
```

## Troubleshooting

1. **No data showing**: Check if `featureFlags.genieSection` is enabled
2. **API calls failing**: Ensure `useMockData` is set to `true`
3. **Data not refreshing**: Clear browser cache and localStorage