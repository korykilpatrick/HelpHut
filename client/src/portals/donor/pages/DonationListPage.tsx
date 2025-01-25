import React from 'react';
import { DonationListView } from '../components/DonationListView';

export function DonationListPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
        <p className="mt-1 text-gray-600">View and manage your donations</p>
      </div>
      <DonationListView />
    </div>
  );
} 