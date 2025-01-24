import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '@/shared/components/inputs/Select';
import { Input } from '@/shared/components/inputs/Input';
import { Textarea } from '@/shared/components/inputs/Textarea';
import { Checkbox } from '@/shared/components/inputs/Checkbox';
import { Button } from '@/shared/components/buttons/Button';
import { FormSection } from '@/shared/components/forms/FormSection';

// Form validation schema
export const donationSchema = z.object({
  foodType: z.string().min(1, 'Food type is required'),
  quantity: z.object({
    amount: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
  }),
  handlingRequirements: z.object({
    refrigeration: z.boolean(),
    fragile: z.boolean(),
    heavyLifting: z.boolean(),
  }),
  pickupWindow: z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  }),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface DonationFormProps {
  onSubmit: (data: DonationFormData) => void;
  isSubmitting?: boolean;
}

const foodTypeOptions = [
  { value: '', label: 'Select food type' },
  { value: 'prepared', label: 'Prepared Food' },
  { value: 'produce', label: 'Fresh Produce' },
  { value: 'pantry', label: 'Pantry Items' },
  { value: 'baked', label: 'Baked Goods' },
  { value: 'other', label: 'Other' },
];

const unitOptions = [
  { value: '', label: 'Select unit' },
  { value: 'lbs', label: 'Pounds' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'items', label: 'Items' },
  { value: 'servings', label: 'Servings' },
];

export function DonationForm({ onSubmit, isSubmitting = false }: DonationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSection
        title="Food Information"
        description="Tell us about the food you'd like to donate"
      >
        <Select
          label="Food Type"
          options={foodTypeOptions}
          error={errors.foodType?.message}
          registration={register('foodType')}
          placeholder="Select the type of food you're donating"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            label="Quantity"
            error={errors.quantity?.amount?.message}
            registration={register('quantity.amount', { valueAsNumber: true })}
            placeholder="Enter amount"
          />
          <Select
            label="Unit"
            options={unitOptions}
            error={errors.quantity?.unit?.message}
            registration={register('quantity.unit')}
            placeholder="Select unit"
          />
        </div>
      </FormSection>

      <FormSection
        title="Handling Requirements"
        description="Let us know about any special handling needs"
      >
        <div className="space-y-2">
          <Checkbox
            label="Requires Refrigeration"
            registration={register('handlingRequirements.refrigeration')}
            description="This food needs to be kept cold"
          />
          <Checkbox
            label="Fragile Items"
            registration={register('handlingRequirements.fragile')}
            description="Handle with extra care"
          />
          <Checkbox
            label="Heavy Lifting Required"
            registration={register('handlingRequirements.heavyLifting')}
            description="Items weigh more than 25 lbs"
          />
        </div>
      </FormSection>

      <FormSection
        title="Pickup Window"
        description="When should we pick up the donation?"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="datetime-local"
            label="Start Time"
            error={errors.pickupWindow?.startTime?.message}
            registration={register('pickupWindow.startTime')}
          />
          <Input
            type="datetime-local"
            label="End Time"
            error={errors.pickupWindow?.endTime?.message}
            registration={register('pickupWindow.endTime')}
          />
        </div>
      </FormSection>

      <FormSection title="Additional Information">
        <Textarea
          label="Notes"
          registration={register('notes')}
          className="h-20"
          placeholder="Add any additional details about your donation..."
        />
      </FormSection>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
        size="lg"
      >
        Submit Donation
      </Button>
    </form>
  );
} 
