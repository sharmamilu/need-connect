# Authentication System Implementation Guide

## Overview

Complete authentication system with token management, protected routes, and automatic API authentication.

---

## 🔐 Features Implemented

### 1. **Secure Token Storage**

- Tokens are stored in Expo SecureStore (encrypted)
- Automatic token retrieval for API requests
- Token persistence across app restarts

### 2. **Automatic API Authentication**

- `apiClient` automatically injects auth token from secure storage
- No need to manually pass tokens to API functions
- Public endpoints (login/register) use `skipAuth: true`

### 3. **Protected Routes**

- All tab screens are protected
- Unauthenticated users are redirected to login
- Loading state while checking authentication

### 4. **Auth Context**

- Global authentication state management
- User data accessible throughout the app
- Login/logout methods available everywhere

---

## 📁 File Structure

```
app/
├── utils/
│   ├── AuthContext.tsx          # Auth state management
│   ├── storage.ts                # Secure token storage
│   └── api/
│       ├── apiClient.ts          # Auto-authenticated API client
│       ├── auth.api.ts           # Login/register endpoints
│       └── user.api.ts           # User-related endpoints
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx    # Route protection component
├── (auth)/
│   ├── login.tsx                 # Login screen
│   └── register.tsx              # Register screen
└── (tabs)/
    ├── _layout.tsx               # Protected tabs layout
    ├── dashboard.tsx             # Home screen
    ├── explore.tsx               # Explore screen
    ├── sell.tsx                  # Sell screen
    ├── messages.tsx              # Messages screen
    └── profile.tsx               # Profile with logout
```

---

## 🚀 How It Works

### Login Flow

1. User enters credentials
2. `loginApi()` sends request to `/auth/login` (skipAuth: true)
3. Server returns:
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGci...",
       "user": {
         "id": "123",
         "name": "John Doe",
         "phone": "1234567890"
       }
     }
   }
   ```
4. Token saved to SecureStore
5. User data saved to AuthContext
6. Redirect to dashboard

### Protected API Requests

```typescript
// Before (manual token passing)
const data = await getMeApi(token);

// After (automatic)
const data = await getMeApi(); // Token auto-injected!
```

### How apiClient Works

```typescript
export const apiClient = async (endpoint, { skipAuth = false }) => {
  const headers = { "Content-Type": "application/json" };

  // Automatically get token for protected routes
  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
  return res.json();
};
```

---

## 🔧 Usage Examples

### Making Protected API Calls

```typescript
// user.api.ts
export const getMeApi = () => {
  return apiClient("/users/me"); // Token auto-added
};

export const updateProfileApi = (data) => {
  return apiClient("/users/profile", {
    method: "PUT",
    body: data,
    // Token auto-added
  });
};
```

### Public Endpoints

```typescript
// auth.api.ts
export const loginApi = (payload) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
    skipAuth: true, // No token needed
  });
};
```

### Using Auth Context

```typescript
import { useAuth } from "../utils/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### Protecting Custom Screens

```typescript
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function MyScreen() {
  return (
    <ProtectedRoute>
      <View>
        {/* Your protected content */}
      </View>
    </ProtectedRoute>
  );
}
```

---

## 🎯 Key Components

### 1. AuthContext (`utils/AuthContext.tsx`)

**Provides:**

- `user`: Current user data
- `isAuthenticated`: Boolean auth status
- `isLoading`: Loading state
- `login(token, userData)`: Login method
- `logout()`: Logout method
- `checkAuth()`: Check auth status

**Usage:**

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### 2. ProtectedRoute (`components/auth/ProtectedRoute.tsx`)

**Features:**

- Checks authentication status
- Shows loading spinner while checking
- Redirects to login if not authenticated
- Renders children if authenticated

**Usage:**

```typescript
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

### 3. apiClient (`utils/api/apiClient.ts`)

**Features:**

- Automatic token injection
- `skipAuth` flag for public endpoints
- Centralized error handling
- JSON content-type headers

**Options:**

```typescript
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  skipAuth?: boolean; // Default: false
};
```

---

## 🔄 Authentication Flow Diagram

```
┌─────────────┐
│   App Start │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  AuthProvider   │
│  checkAuth()    │
└──────┬──────────┘
       │
       ├─── Token exists? ───┐
       │                     │
      YES                   NO
       │                     │
       ▼                     ▼
┌─────────────┐      ┌──────────────┐
│  Set User   │      │  Redirect to │
│  Navigate   │      │    Login     │
│  to Tabs    │      └──────────────┘
└─────────────┘
       │
       ▼
┌─────────────────┐
│  User Logs Out  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Remove Token   │
│  Clear User     │
│  Go to Login    │
└─────────────────┘
```

---

## 📝 API Response Format

Your backend should return this format:

### Login/Register Success

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "69942746d95a32d7f7615caa",
      "name": "Milan Sharma",
      "phone": "8553485846"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🛡️ Security Features

1. **Secure Storage**: Tokens stored in encrypted SecureStore
2. **Auto Token Injection**: No token exposure in component code
3. **Protected Routes**: Unauthorized access prevented
4. **Token Cleanup**: Tokens removed on logout
5. **Error Handling**: Graceful handling of auth failures

---

## 🎨 Customization

### Change API Base URL

```typescript
// utils/api/apiClient.ts
const BASE_URL = "https://your-api.com/api";
```

### Add More User Fields

```typescript
// utils/AuthContext.tsx
type User = {
  id: string;
  name: string;
  phone: string;
  email?: string; // Add this
  avatar?: string; // Add this
};
```

### Customize Redirect Behavior

```typescript
// components/auth/ProtectedRoute.tsx
if (!isAuthenticated) {
  router.replace("/custom-login-page" as any);
}
```

---

## ✅ Testing Checklist

- [ ] Login saves token to SecureStore
- [ ] Login saves user data to AuthContext
- [ ] Protected routes redirect when not authenticated
- [ ] API calls include Authorization header
- [ ] Logout clears token and user data
- [ ] Logout redirects to login
- [ ] App remembers user after restart
- [ ] Profile shows correct user data

---

## 🐛 Troubleshooting

### Token not being sent with requests

- Check if `skipAuth` is accidentally set to `true`
- Verify token is saved: `console.log(await getToken())`

### Always redirected to login

- Check if token exists in SecureStore
- Verify AuthContext is wrapping the app
- Check ProtectedRoute implementation

### User data not showing

- Verify API response includes `user` object
- Check if `login()` is called with user data
- Inspect AuthContext state

---

## 🚀 Next Steps

1. **Add Token Refresh**: Implement automatic token refresh
2. **Add Remember Me**: Optional persistent login
3. **Add Biometric Auth**: Fingerprint/Face ID
4. **Add Session Timeout**: Auto-logout after inactivity
5. **Add Multi-device Support**: Manage sessions across devices

---

## 📚 Related Files

- `app/utils/storage.ts` - Token storage utilities
- `app/utils/AuthContext.tsx` - Authentication state
- `app/utils/api/apiClient.ts` - API client with auto-auth
- `app/components/auth/ProtectedRoute.tsx` - Route protection
- `app/(auth)/login.tsx` - Login implementation
- `app/(tabs)/profile.tsx` - Logout implementation
