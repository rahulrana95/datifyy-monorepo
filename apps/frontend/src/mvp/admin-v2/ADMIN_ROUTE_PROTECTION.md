# Admin Route Protection

## Overview
All admin routes are now protected with authentication and authorization checks. Users must be logged in with admin privileges to access any admin panel pages.

## Implementation

### 1. AdminProtectedRoute Component
A wrapper component that validates admin access before rendering protected routes.

**Features:**
- Token validation on every route access
- Admin privilege verification
- Automatic redirect to `/admin/login` if unauthorized
- Loading state during validation
- Updates auth store with user data

### 2. Route Structure
```tsx
<Route path="/admin/login" element={<AdminLoginPage />} />
<Route path="/admin" element={<AdminProtectedRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboardContainer />} />
    <Route path="curate-dates" element={<CurateDatesContainer />} />
    <Route path="dates-management" element={<CuratedDatesManagementContainer />} />
    <Route path="revenue" element={<RevenueTrackingContainer />} />
    <Route path="genie" element={<GenieSectionContainer />} />
  </Route>
</Route>
```

### 3. Authentication Flow

#### On Admin Route Access:
1. Check for token in localStorage/sessionStorage
2. If no token → Redirect to `/admin/login`
3. If token exists → Validate with backend
4. If validation fails → Redirect to `/admin/login`
5. If valid → Check admin privileges
6. If not admin → Redirect to `/admin/login`
7. If admin → Allow access and render route

#### On Admin Login Page:
1. Check if already authenticated as admin
2. If yes → Auto-redirect to `/admin/dashboard`
3. If no → Show login form

### 4. Security Features

- **Token Validation**: Every admin route access validates the token
- **Admin Check**: Verifies user has admin privileges (`isAdmin` flag)
- **Auth Store Sync**: Updates global auth state for consistency
- **Session Handling**: Works with both localStorage and sessionStorage
- **Error Handling**: Graceful fallback to login on any error

## Usage

### Protected Admin Routes
All routes under `/admin/*` (except `/admin/login`) are automatically protected.

### Adding New Admin Routes
Simply add routes as children of the AdminLayout:
```tsx
<Route path="new-feature" element={<NewFeatureContainer />} />
```

### Checking Admin Status in Components
```tsx
import { useAuthStore } from '../login-signup';

const MyComponent = () => {
  const authStore = useAuthStore();
  const isAdmin = authStore.userData?.isAdmin;
  
  if (isAdmin) {
    // Show admin features
  }
};
```

## Testing

1. **Not Logged In**: Navigate to `/admin/dashboard` → Should redirect to `/admin/login`
2. **Non-Admin User**: Login as regular user, try `/admin/*` → Should redirect to `/admin/login`
3. **Admin User**: Login as admin → Should access all admin routes
4. **Token Expiry**: Invalidate token, try admin route → Should redirect to `/admin/login`
5. **Already Logged In**: As admin, go to `/admin/login` → Should auto-redirect to `/admin/dashboard`

## Error Scenarios

1. **Network Error**: Shows login page (fail-safe)
2. **Invalid Token**: Clears auth and redirects to login
3. **Backend Down**: Denies access and shows login
4. **Missing Admin Flag**: Treats as non-admin

## Future Enhancements

1. **Role-Based Access**: Different admin levels
2. **Permission Checks**: Feature-specific permissions
3. **2FA Support**: Two-factor authentication for admins
4. **Session Timeout**: Auto-logout after inactivity
5. **Audit Logging**: Track admin actions