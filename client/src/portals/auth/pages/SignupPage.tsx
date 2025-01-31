import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/shared/components/inputs/Input';
import { Button } from '@/shared/components/buttons/Button';
import { Select } from '@/shared/components/inputs/Select';
import { api } from '@/core/api';
import { useAuth } from '@/core/auth/useAuth';
import { toast } from '@/shared/components/toast';
import { getSignupSchema, type SignupData } from '../types';
import { z } from 'zod';
import { Package, Users, Building2 } from 'lucide-react';

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Mission and Features */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:px-16 lg:py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="flex flex-col items-center text-center mb-8">
          <img 
            src="/helphut_logo.png"
            alt="HelpHut Logo" 
            className="h-40 w-auto mb-10"
          />
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-6 max-w-xl">
            HelpHut
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Join our mission to reduce food waste and fight hunger in your local community.
          </p>
        </div>
          
        <div className="grid grid-cols-1 gap-10 max-w-lg mx-auto">
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Food Donors</h3>
              <p className="text-gray-600">Easily donate surplus food and track your community impact</p>
            </div>
          </div>
            
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Volunteers</h3>
              <p className="text-gray-600">Help deliver food to those who need it most</p>
            </div>
          </div>
            
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partner Organizations</h3>
              <p className="text-gray-600">Receive donations and manage your food inventory efficiently</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img 
              src="/helphut_logo.png"
              alt="HelpHut Logo" 
              className="mx-auto h-24 w-auto lg:hidden"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your account
              </Link>
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
    </div>
  );
} 