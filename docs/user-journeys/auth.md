# Authentication Journey

## Overview
This document outlines the technical implementation of HelpHut's authentication system, which uses Supabase Auth for user management and includes role-based access control with support for multiple organization types (Donors, Volunteers, Partners).

## Technical Flow

### 1. Login Process
**File**: `client/src/portals/auth/pages/LoginPage.tsx`

#### Component Structure:
```typescript
export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
}
```

#### Login Flow:
1. User enters email and password
2. Form submission triggers `handleSubmit`:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsSubmitting(true);
  
  try {
    await login(email, password);
    // Navigation handled by AuthProvider
  } catch (err: any) {
    if (err.response?.data?.error === 'Email not confirmed') {
      setError('Please confirm your email address...');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  }
};
```

### 2. Authentication Provider
**File**: `client/src/core/auth/AuthProvider.tsx`

#### Context Setup:
```typescript
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
```

#### Key Components:
1. **Session Management**:
   - Stores auth token in localStorage
   - Sets up axios interceptors for auth headers
   - Handles session persistence

2. **Role-Based Routing**:
   ```typescript
   const getDefaultPath = (role: UserRole) => {
     switch (role) {
       case 'donor':
         return '/donor/dashboard';
       case 'volunteer':
         return '/volunteer/dashboard';
       case 'partner':
         return '/partner/dashboard';
       case 'admin':
         return '/admin/dashboard';
       default:
         return '/';
     }
   };
   ```

3. **Organization ID Resolution**:
   ```typescript
   const getOrganizationId = (user: any) => {
     switch (user.role.toLowerCase()) {
       case 'donor':
         return user.donor?.id;
       case 'volunteer':
         return user.volunteer?.id;
       case 'partner':
         return user.partner?.id;
       default:
         return undefined;
     }
   };
   ```

### 3. Backend Authentication
**File**: `server/routes/auth.ts`

#### Login Endpoint:
```typescript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Supabase authentication
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
  }

  // Fetch additional user data
  const { data: userData } = await supabaseAuth
    .from('users')
    .select(`
      id,
      role,
      display_name,
      partners!partners_user_id_fkey(id),
      donors!donors_user_id_fkey(id),
      volunteers!volunteers_user_id_fkey(id)
    `)
    .eq('id', data.user.id)
    .single();
});
```

### 4. Route Protection
**File**: `client/src/core/auth/RouteGuard.tsx`

#### Implementation:
```typescript
export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const defaultPath = getDefaultPath(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
}
```

### 5. Session Management
1. **Initial Load**:
   - Checks localStorage for existing token
   - Validates token with backend
   - Sets up axios interceptors

2. **Session Persistence**:
   - Token stored in localStorage
   - Automatic token injection in requests
   - Session validation on app load

3. **Session Expiry**:
   - Automatic logout on token expiry
   - Cleanup of stored credentials
   - Redirect to login page

### 6. Error Handling
1. **Login Errors**:
   - Invalid credentials
   - Unconfirmed email
   - Network issues
   - Server errors

2. **Session Errors**:
   - Token expiration
   - Invalid token
   - Server disconnection

## Database Schema

### Supabase Auth Tables
The authentication system uses Supabase's built-in `auth.users` table for core authentication, which handles:
- Email/password credentials
- Session management
- Password reset functionality
- Email verification

### Application User Profile
```sql
-- Users (application profiles linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);
```

### Automatic Profile Creation
A trigger automatically creates user profiles when new auth users are created:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  role_val text;
  display_name_val text;
BEGIN
  -- Extract role and display name from metadata
  role_val := COALESCE(NEW.raw_user_meta_data->>'role', 'Donor');
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'name', 
    split_part(NEW.email, '@', 1)
  );

  -- Create user profile
  INSERT INTO public.users (id, display_name, role)
  VALUES (
    NEW.id,
    display_name_val,
    role_val::user_role
  );

  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Role-Specific Profile Tables
Each user role has an additional profile table:

1. **Donors**:
```sql
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  organization_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_hours TEXT,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

2. **Volunteers**:
```sql
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  phone TEXT NOT NULL,
  vehicle_type TEXT,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

3. **Partners**:
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  name TEXT NOT NULL,
  max_capacity INT DEFAULT 0,
  capacity INT DEFAULT 0,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout
- GET `/auth/session` - Validate session
- POST `/auth/signup` - User registration

## Related Files
- `client/src/core/auth/AuthProvider.tsx`
- `client/src/core/auth/RouteGuard.tsx`
- `client/src/core/auth/types.ts`
- `client/src/portals/auth/pages/LoginPage.tsx`
- `server/routes/auth.ts`
- `lib/db/types.ts`

## Security Considerations
1. **Token Management**:
   - Secure storage in localStorage
   - Regular token rotation
   - Proper cleanup on logout

2. **Role-Based Access**:
   - Route protection
   - API endpoint protection
   - Data access restrictions

3. **Error Handling**:
   - No sensitive info in errors
   - Proper error logging
   - User-friendly messages

4. **Password Security**:
   - Minimum length requirements
   - Complexity validation
   - Secure storage (handled by Supabase) 
