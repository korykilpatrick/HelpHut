export type UserRole = 'admin' | 'donor' | 'volunteer' | 'partner';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organizationId?: string;
  organizationName?: string;  // Optional since volunteers won't have one
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error?: string;
} 