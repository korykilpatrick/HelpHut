import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { DonationForm } from '../components/DonationForm';
import type { z } from 'zod';
import { api } from '../../../core/api';
import { useAuth } from '../../../core/auth/useAuth';
import { toast } from '../../../shared/components/toast';

export function DonationSubmissionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    console.log('DonationSubmissionPage mounted - Current user:', user);
    
    // Check for required user data
    if (user && !user.organizationId) {
      console.error('User is missing organizationId:', user);
      toast.error('Your donor profile is not properly set up. Please contact support.');
      navigate('/donor/dashboard');
    }
  }, [user, navigate]);

  // Protect against no user or missing organization ID
  if (!user || !user.organizationId) {
    console.log('Missing user or organizationId, redirecting');
    return <Navigate to="/donor/dashboard" replace />;
  }

  const handleSubmit = async (data: z.infer<typeof import('../components/DonationForm').donationSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Transform form data to API format
      const donationData = {
        donor_id: user.organizationId, // Now we know this exists
        food_type_id: data.foodType,
        quantity: data.quantity.amount,
        unit: data.quantity.unit,
        requires_refrigeration: data.handlingRequirements.refrigeration,
        requires_freezing: data.handlingRequirements.freezing,
        is_fragile: data.handlingRequirements.fragile,
        requires_heavy_lifting: data.handlingRequirements.heavyLifting,
        pickup_window_start: data.pickupWindow.startTime,
        pickup_window_end: data.pickupWindow.endTime,
        notes: data.notes
      };

      console.log('Submitting donation:', donationData);
      await api.donations.createDonation(donationData);
      
      toast.success('Donation submitted successfully!');
      navigate('/donor/dashboard', { 
        state: { 
          message: 'Donation submitted successfully!' 
        } 
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Submit a Donation
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for helping us reduce food waste and feed those in need.
          </p>
        </div>
        <div className="transform transition-all duration-500 hover:translate-y-[-2px]">
          <DonationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
} 