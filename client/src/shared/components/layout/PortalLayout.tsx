import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '../../../core/app/layouts/MainLayout';
import { useAppDispatch } from '../../../core/store/hooks';
import { setCurrentPortal } from '../../../core/store/slices/navigationSlice';

interface PortalConfig {
  id: string;
  title: string;
}

interface PortalLayoutProps {
  children?: React.ReactNode;
  config: PortalConfig;
}

export function PortalLayout({ children, config }: PortalLayoutProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Set the current portal in Redux when the component mounts or config changes
  useEffect(() => {
    dispatch(setCurrentPortal(config.id as any)); // TODO: Fix type
  }, [dispatch, config.id]);

  return <MainLayout>{children}</MainLayout>;
} 