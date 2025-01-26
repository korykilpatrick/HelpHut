import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/components/inputs/Input';
import { Button } from '@/shared/components/buttons/Button';
import { Select } from '@/shared/components/inputs/Select';
import { api } from '@/core/api';
import { useAuth } from '@/core/auth/useAuth';
import { toast } from '@/shared/components/toast';
import { getSignupSchema, type SignupData } from '../types';
import { z } from 'zod';

const roleOptions = [
  { value: 'Donor', label: 'Food Donor' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Partner', label: 'Partner Organization' }
];

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Donor', 'Volunteer', 'Partner']),
  name: z.string().min(1, 'Name is required'),
  organizationName: z.string().optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  businessHours: z.string().optional(),
  vehicleType: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState('Donor');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupData>({
    resolver: zodResolver(getSignupSchema(selectedRole)),
    defaultValues: {
      role: 'Donor' as const,
    }
  });

  // Watch the role field to update the form schema
  React.useEffect(() => {
    const role = watch('role');
    if (role !== selectedRole) {
      setSelectedRole(role);
    }
  }, [watch('role'), selectedRole]);

  // Helper to safely get error messages
  const getErrorMessage = (field: string) => {
    return (errors as any)[field]?.message as string | undefined;
  };

  const onSubmit = async (data: SignupData) => {
    try {
      setIsSubmitting(true);
      
      // Sign up the user
      await api.auth.signup(data);
      
      // Log them in
      await login(data.email, data.password);
      
      toast.success('Account created successfully!');
      navigate(`/${data.role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us in reducing food waste and feeding those in need
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Name"
              type="text"
              error={getErrorMessage('name')}
              registration={register('name')}
              placeholder="Your name"
            />

            <Input
              label="Email"
              type="email"
              error={getErrorMessage('email')}
              registration={register('email')}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              error={getErrorMessage('password')}
              registration={register('password')}
              placeholder="••••••••"
            />

            <Select
              label="I am a..."
              options={roleOptions}
              error={getErrorMessage('role')}
              registration={register('role')}
            />

            {/* Donor-specific fields */}
            {selectedRole === 'Donor' && (
              <>
                <Input
                  label="Organization Name"
                  error={getErrorMessage('organizationName')}
                  registration={register('organizationName')}
                  placeholder="Your organization's name"
                />
                <Input
                  label="Phone Number"
                  error={getErrorMessage('phone')}
                  registration={register('phone')}
                  placeholder="(555) 555-5555"
                />
                <Input
                  label="Business Hours"
                  error={getErrorMessage('businessHours')}
                  registration={register('businessHours')}
                  placeholder="e.g. Mon-Fri 9am-5pm"
                />
              </>
            )}

            {/* Volunteer-specific fields */}
            {selectedRole === 'Volunteer' && (
              <>
                <Input
                  label="Phone Number"
                  error={getErrorMessage('phone')}
                  registration={register('phone')}
                  placeholder="(555) 555-5555"
                />
                <Input
                  label="Vehicle Type"
                  error={getErrorMessage('vehicleType')}
                  registration={register('vehicleType')}
                  placeholder="e.g. Sedan, SUV, Van"
                />
              </>
            )}

            {/* Partner-specific fields */}
            {selectedRole === 'Partner' && (
              <>
                <Input
                  label="Organization Name"
                  error={getErrorMessage('organizationName')}
                  registration={register('organizationName')}
                  placeholder="Your organization's name"
                />
                <Input
                  label="Organization Contact Email"
                  type="email"
                  error={getErrorMessage('contactEmail')}
                  registration={register('contactEmail')}
                  placeholder="contact@organization.com"
                />
                <Input
                  label="Phone Number"
                  error={getErrorMessage('phone')}
                  registration={register('phone')}
                  placeholder="(555) 555-5555"
                />
              </>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
} 