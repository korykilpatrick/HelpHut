import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../core/api';
import { DonationForm } from '../components/DonationForm';
import { toast } from '../../../shared/components/toast';
import { useAuth } from '../../../core/auth/useAuth';
import { useDonorProfile } from '../hooks/useDonorProfile';

export function DonationSubmissionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: donorProfile, isLoading: isDonorProfileLoading } = useDonorProfile();
  
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        if (!donorProfile?.id) {
          throw new Error('No donor profile found. Please contact support.');
        }

        // Transform the data to match the server's expected format
        // Note: The API layer will handle snake_case transformation
        const donationData = {
          donorId: donorProfile.id, // Use the donor ID from the profile
          foodTypeId: data.foodType,
          quantity: Number(data.quantity.amount),
          unit: data.quantity.unit,
          pickupWindowStart: new Date(data.pickupWindow.startTime).toISOString(),
          pickupWindowEnd: new Date(data.pickupWindow.endTime).toISOString(),
          requiresRefrigeration: Boolean(data.handlingRequirements.refrigeration),
          requiresFreezing: Boolean(data.handlingRequirements.freezing),
          isFragile: Boolean(data.handlingRequirements.fragile),
          requiresHeavyLifting: Boolean(data.handlingRequirements.heavyLifting),
          notes: data.notes || '',
        };

        // Validate dates
        const startDate = new Date(donationData.pickupWindowStart);
        const endDate = new Date(donationData.pickupWindowEnd);
        if (startDate >= endDate) {
          throw new Error('Pickup window end time must be after start time');
        }

        // Log the data before transformation
        console.log('Submitting donation with data (before transformation):', donationData);
        
        const response = await api.donations.createDonation(donationData);
        return response.data;
      } catch (error: any) {
        // Log the full error object for debugging
        console.error('Full error object:', error);
        
        // Log detailed error information
        console.error('Detailed error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          data: error.response?.data?.error,
          stack: error.stack,
          originalRequest: error.config?.data ? JSON.parse(error.config.data) : null,
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Donation submitted successfully!');
      navigate('/donor/history');
    },
    onError: (error: any) => {
      // Log the full error object for debugging
      console.error('Full error object:', error);
      
      // Log detailed error information
      console.error('Error submitting donation:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data?.error,
        stack: error.stack,
        originalRequest: error.config?.data ? JSON.parse(error.config.data) : null,
      });
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to submit donation. Please try again.';
      toast.error(errorMessage);
    },
  });

  if (isDonorProfileLoading) {
    return <div>Loading donor profile...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit a Donation</h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below to submit a new food donation.
        </p>
      </div>

      <DonationForm
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
} 