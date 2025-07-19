# Admin Token Persistence Fix

## Problem
Admin users were getting logged out when refreshing the dashboard page because the AdminProtectedRoute was looking for regular user tokens instead of admin-specific tokens.

## Root Cause
1. AdminAuthService stores tokens as `admin_access_token` in localStorage/sessionStorage
2. AdminProtectedRoute was checking for regular `token` instead of `admin_access_token`
3. Token wasn't being set in the API service on page refresh

## Solution

### 1. Updated AdminProtectedRoute
Changed token validation to check for admin-specific tokens:

```typescript
// Before
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

// After  
const adminToken = localStorage.getItem('admin_access_token') || sessionStorage.getItem('admin_access_token');
```

Also added token restoration to API service:
```typescript
// Set the token in API service for subsequent calls
await apiService.setAuthToken(adminToken);
```

### 2. Updated AdminLoginPage
Fixed the auth check to look for admin tokens:

```typescript
const checkExistingAuth = async () => {
    // Check for admin token specifically
    const adminToken = localStorage.getItem('admin_access_token') || sessionStorage.getItem('admin_access_token');
    
    if (!adminToken) {
        setIsCheckingAuth(false);
        return;
    }

    // Set token in API service
    await apiService.setAuthToken(adminToken);

    // Validate token
    const { response, error } = await authService.verifyToken();
    
    if (!error && response) {
        // Admin token is valid, redirect to dashboard
        navigate('/admin/dashboard', { replace: true });
        return;
    }
};
```

## Token Storage Structure

### Admin Tokens (stored by AdminAuthService):
- `admin_access_token` - JWT access token
- `admin_session_id` - Session identifier
- `admin_remember_me` - Remember me preference
- `admin_profile` - Admin user profile data

### Storage Location:
- **Remember Me = true**: localStorage (persistent)
- **Remember Me = false**: sessionStorage (session only)

## Auth Flow

### Login:
1. Admin enters credentials
2. AdminAuthService stores tokens as `admin_access_token`
3. Token set in API service for immediate use
4. Redirect to dashboard

### Page Refresh:
1. AdminProtectedRoute checks for `admin_access_token`
2. If found, sets token in API service
3. Validates token with backend
4. If valid, allows access
5. If invalid or missing, redirects to login

### Logout:
1. Clear all admin tokens from both storages
2. Clear token from API service
3. Redirect to login page

## Testing

1. **Login with Remember Me**:
   - Login to admin portal
   - Check "Remember Me"
   - Refresh page → Should stay logged in
   - Close browser, reopen → Should stay logged in

2. **Login without Remember Me**:
   - Login to admin portal
   - Don't check "Remember Me"
   - Refresh page → Should stay logged in
   - Close browser tab → Session ends

3. **Token Validation**:
   - Login successfully
   - Manually delete `admin_access_token` from storage
   - Refresh page → Should redirect to login

## Benefits

1. **Separate Token Namespace**: Admin tokens don't conflict with regular user tokens
2. **Proper Persistence**: Respects "Remember Me" preference
3. **API Integration**: Token automatically set for all API calls
4. **Security**: Admin sessions properly isolated from user sessions