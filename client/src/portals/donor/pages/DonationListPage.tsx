import React from 'react';
import { DonationListView } from '../components/DonationListView';

export function DonationListPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Donation History</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your food donations.
        </p>
      </div>

      <DonationListView />
    </div>
  );
} 