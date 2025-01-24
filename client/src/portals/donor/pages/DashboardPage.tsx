import React from 'react';
import { useAuth } from '@/core/auth/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Welcome, {user?.name || 'Donor'}</h2>
        <p className="text-gray-600">
          Use the cards above to manage your donations and view your impact.
        </p>
      </div>
    </div>
  );
} 