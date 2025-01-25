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
import { api } from '@/core/api';

// Form validation schema
export const donationSchema = z.object({
  foodType: z.string().uuid('Invalid food type selected'),
  quantity: z.object({
    amount: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
  }),
  handlingRequirements: z.object({
    refrigeration: z.boolean(),
    freezing: z.boolean(),
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

const unitOptions = [
  { value: '', label: 'Select unit' },
  { value: 'lbs', label: 'Pounds' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'items', label: 'Items' },
  { value: 'servings', label: 'Servings' },
];

export function DonationForm({ onSubmit, isSubmitting = false }: DonationFormProps) {
  const [foodTypes, setFoodTypes] = React.useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Calculate default pickup window times
  const defaultStartTime = React.useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  }, []);

  const defaultEndTime = React.useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to noon tomorrow
    return tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  }, []);

  React.useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        console.log('Fetching food types...');
        const response = await api.foodTypes.list();
        console.log('Food types response:', response.data);
        setFoodTypes(response.data.foodTypes || []);
      } catch (error) {
        console.error('Error fetching food types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodTypes();
  }, []);

  const foodTypeOptions = React.useMemo(() => {
    const options = [
      { value: '', label: 'Select food type' },
      ...foodTypes.map(type => ({
        value: type.id,
        label: type.name,
      })),
    ];
    console.log('Food type options:', options);
    return options;
  }, [foodTypes]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      pickupWindow: {
        startTime: defaultStartTime,
        endTime: defaultEndTime
      }
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">
      <div className="text-gray-600">Loading food types...</div>
    </div>;
  }

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
            description="This food needs to be kept cold (35-40°F)"
          />
          <Checkbox
            label="Requires Freezing"
            registration={register('handlingRequirements.freezing')}
            description="This food needs to be kept frozen (0°F or below)"
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
