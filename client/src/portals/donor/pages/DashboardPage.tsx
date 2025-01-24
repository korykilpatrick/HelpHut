import React from 'react';
import { useAuth } from '@/core/auth/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          Thank you for being part of our food rescue mission. Here's what you can do:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900">Quick Donate</h2>
          <p className="text-blue-700">Submit a new food donation in minutes.</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold text-green-900">Track Impact</h2>
          <p className="text-green-700">See how your donations are making a difference.</p>
        </div>
      </div>
    </div>
  );
} 