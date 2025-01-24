import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DonationForm } from '../components/DonationForm';
import type { z } from 'zod';

export function DonationSubmissionPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: z.infer<typeof import('../components/DonationForm').donationSchema>) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement API call to submit donation
      console.log('Submitting donation:', data);
      
      // Temporarily simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to success page or dashboard
      navigate('/donor/dashboard', { 
        state: { 
          message: 'Donation submitted successfully!' 
        } 
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      // TODO: Implement error handling
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