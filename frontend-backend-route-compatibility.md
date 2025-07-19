# Frontend-Backend Route Compatibility Analysis

## Overview
This document analyzes the compatibility between frontend API calls and backend routes in the Datifyy monorepo.

## Key Findings

### 1. API Prefix Mismatch
- **Frontend apiService.ts**: Uses prefix `/api/v1`
- **Backend routes**: No `/api/v1` prefix in route definitions
- **Impact**: All frontend API calls will fail with 404 errors

### 2. Route Structure Differences

#### Admin Dashboard Routes
| Frontend Service | Frontend Route | Backend Route | Status |
|-----------------|----------------|---------------|---------|
| dashboardService.ts | `/admin/dashboard/metrics` | `/admin/dashboard/metrics/summary` | ❌ MISMATCH |
| dashboardService.ts | `/admin/dashboard/revenue` | `/admin/dashboard/revenue/summary` | ❌ MISMATCH |
| dashboardService.ts | `/admin/dashboard/location-activity` | Not found in backend | ❌ MISSING |
| dashboardService.ts | `/admin/dashboard/export/{type}` | `/admin/dashboard/export/metrics` | ❌ MISMATCH |

#### Curate Dates Routes
| Frontend Service | Frontend Route | Backend Route | Status |
|-----------------|----------------|---------------|---------|
| curateDatesService.ts | `admin/curate-dates` (no leading /) | `/admin/date-curation/*` | ❌ MISMATCH |

## Required Fixes

### 1. Remove API Version Prefix
The backend doesn't use `/api/v1` prefix. Options:
- **Option A**: Remove prefix from frontend apiService.ts
- **Option B**: Add `/api/v1` prefix to backend routes (requires backend changes)
- **Recommendation**: Option A - easier to implement, less disruptive

### 2. Update Frontend Service Routes

#### dashboardService.ts
```typescript
// Current
const ADMIN_API_PREFIX = '/admin/dashboard';

// Should be (after removing /api/v1 prefix)
const ADMIN_API_PREFIX = 'admin/dashboard';

// Update specific endpoints
- `${ADMIN_API_PREFIX}/metrics` → `${ADMIN_API_PREFIX}/metrics/summary`
- `${ADMIN_API_PREFIX}/revenue` → `${ADMIN_API_PREFIX}/revenue/summary`
- `${ADMIN_API_PREFIX}/location-activity` → `${ADMIN_API_PREFIX}/users/geographic-distribution`
```

#### curateDatesService.ts
```typescript
// Current
const ADMIN_API_PREFIX = 'admin/curate-dates';

// Should be
const ADMIN_API_PREFIX = 'admin/date-curation';
```

### 3. Missing Backend Routes
Some frontend routes don't have corresponding backend endpoints:
- `/admin/dashboard/location-activity` - Use `/admin/dashboard/users/geographic-distribution` instead
- Generic export endpoint needs to map to specific export routes

### 4. Authentication Headers
- Frontend uses `Authorization: {token}` header
- Backend expects `Authorization: Bearer {token}` header
- Need to update apiService.ts to add "Bearer " prefix

## Implementation Plan

1. **Fix API Prefix** (Priority: HIGH)
   - Remove `/api/v1` prefix from apiService.ts
   - Update all service files to not include leading slash

2. **Update Route Mappings** (Priority: HIGH)
   - Update dashboardService.ts routes
   - Update curateDatesService.ts routes
   - Update other service files as needed

3. **Fix Authentication** (Priority: HIGH)
   - Update setAuthToken method to include "Bearer " prefix

4. **Test Integration** (Priority: MEDIUM)
   - Test each endpoint with feature flag set to false
   - Verify authentication flow
   - Check error handling

## Next Steps
1. Implement the fixes in the frontend services
2. Test with actual backend API
3. Update any remaining service files
4. Document any additional mismatches found during testing