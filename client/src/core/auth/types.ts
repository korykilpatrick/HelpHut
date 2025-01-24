export type UserRole = 'admin' | 'donor' | 'volunteer' | 'partner';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organizationId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error?: string;
} 