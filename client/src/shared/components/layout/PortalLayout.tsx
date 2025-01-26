import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '../../../core/app/layouts/MainLayout';
import { useAppDispatch } from '../../../core/store/hooks';
import { setCurrentPortal } from '../../../core/store/slices/navigationSlice';
import { type PortalConfig } from '../../../portals/types';
import type { NavigationState } from '../../../core/store/slices/navigationSlice';

interface PortalLayoutProps {
  children?: React.ReactNode;
  config: PortalConfig;
}

export function PortalLayout({ children, config }: PortalLayoutProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Set the current portal in Redux when the component mounts or config changes
  useEffect(() => {
    // Convert role to the format expected by NavigationState
    const portalId = config.role.toLowerCase() as NavigationState['currentPortal'];
    dispatch(setCurrentPortal(portalId));
  }, [dispatch, config.role]);

  return <MainLayout>{children}</MainLayout>;
} 