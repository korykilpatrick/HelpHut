import { type ReactNode } from 'react';
import { type UserRole } from '../core/auth/types';

export interface PortalConfig {
  role: UserRole;
  title: string;
  description: string;
  features: PortalFeature[];
}

export interface PortalFeature {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
} 