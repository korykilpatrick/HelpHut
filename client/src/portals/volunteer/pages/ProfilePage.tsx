import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Phone,
  Mail,
  Car,
  Bell,
  Shield,
  Save,
  AlertCircle
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import { Input } from '../../../shared/components/inputs/Input';
import { Select } from '../../../shared/components/inputs/Select';
import { Switch } from '../../../shared/components/inputs/Switch';
import { Avatar } from '../../../shared/components/base/Avatar';
import { toast } from '../../../shared/components/toast';

interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  vehicle: {
    type: 'car' | 'suv' | 'van' | 'truck';
    capacity: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    availability: {
      weekdays: boolean;
      weekends: boolean;
      evenings: boolean;
    };
    maxDistance: number;
  };
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<VolunteerProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    vehicle: {
      type: 'car',
      capacity: ''
    },
    preferences: {
      notifications: {
        email: false,
        sms: false,
        push: false
      },
      availability: {
        weekdays: false,
        weekends: false,
        evenings: false
      },
      maxDistance: 5
    }
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['volunteerProfile'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '(512) 555-0123',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          vehicle: {
            type: 'suv',
            capacity: 'Medium (up to 200 lbs)'
          },
          preferences: {
            notifications: {
              email: true,
              sms: true,
              push: false
            },
            availability: {
              weekdays: true,
              weekends: true,
              evenings: false
            },
            maxDistance: 10
          }
        } as VolunteerProfile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<VolunteerProfile>) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerProfile'] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  });

  React.useEffect(() => {
    if (profile && !isEditing) {
      setFormData(profile);
    }
  }, [profile, isEditing]);

  const handleInputChange = (
    field: keyof VolunteerProfile,
    value: string | boolean | number | object
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (
    category: 'notifications' | 'availability',
    field: string,
    value: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your volunteer profile and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <BaseCard>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                  Your personal details and vehicle information
                </p>
              </div>
              <BaseButton
                variant={isEditing ? 'ghost' : 'default'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </BaseButton>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <Avatar
                src={profile?.avatarUrl}
                alt={profile?.name}
                size="xl"
                fallback={profile?.name?.charAt(0)}
              />
              {isEditing && (
                <BaseButton variant="outline" size="sm">
                  Change Photo
                </BaseButton>
              )}
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Vehicle Type"
                  value={formData.vehicle?.type}
                  onChange={(e) => handleInputChange('vehicle', {
                    ...formData.vehicle,
                    type: e.target.value
                  })}
                  options={[
                    { value: 'car', label: 'Car' },
                    { value: 'suv', label: 'SUV' },
                    { value: 'van', label: 'Van' },
                    { value: 'truck', label: 'Truck' }
                  ]}
                  disabled={!isEditing}
                />
                <Select
                  label="Vehicle Capacity"
                  value={formData.vehicle?.capacity}
                  onChange={(e) => handleInputChange('vehicle', {
                    ...formData.vehicle,
                    capacity: e.target.value
                  })}
                  options={[
                    { value: 'Small (up to 100 lbs)', label: 'Small (up to 100 lbs)' },
                    { value: 'Medium (up to 200 lbs)', label: 'Medium (up to 200 lbs)' },
                    { value: 'Large (up to 400 lbs)', label: 'Large (up to 400 lbs)' },
                    { value: 'Extra Large (400+ lbs)', label: 'Extra Large (400+ lbs)' }
                  ]}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <BaseButton
                    variant="default"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </BaseButton>
                </div>
              )}
            </div>
          </BaseCard>
        </div>

        {/* Preferences */}
        <div className="space-y-8">
          {/* Notifications */}
          <BaseCard>
            <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">Email Notifications</BaseText>
                  <BaseText size="sm" variant="muted">
                    Receive updates via email
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.notifications.email}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('notifications', 'email', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">SMS Notifications</BaseText>
                  <BaseText size="sm" variant="muted">
                    Receive updates via text
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.notifications.sms}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('notifications', 'sms', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">Push Notifications</BaseText>
                  <BaseText size="sm" variant="muted">
                    Receive mobile push notifications
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.notifications.push}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('notifications', 'push', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </BaseCard>

          {/* Availability */}
          <BaseCard>
            <h2 className="mb-4 text-lg font-semibold">Availability</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">Weekdays</BaseText>
                  <BaseText size="sm" variant="muted">
                    Available Monday-Friday
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.availability.weekdays}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('availability', 'weekdays', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">Weekends</BaseText>
                  <BaseText size="sm" variant="muted">
                    Available Saturday-Sunday
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.availability.weekends}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('availability', 'weekends', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <BaseText weight="medium">Evenings</BaseText>
                  <BaseText size="sm" variant="muted">
                    Available after 5 PM
                  </BaseText>
                </div>
                <Switch
                  checked={formData.preferences.availability.evenings}
                  onCheckedChange={(checked: boolean) =>
                    handlePreferenceChange('availability', 'evenings', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </BaseCard>

          {/* Distance Preference */}
          <BaseCard>
            <h2 className="mb-4 text-lg font-semibold">Distance Preference</h2>
            <Select
              label="Maximum Travel Distance"
              value={formData.preferences?.maxDistance?.toString()}
              onChange={(e) => handleInputChange('preferences', {
                ...formData.preferences,
                maxDistance: parseInt(e.target.value)
              })}
              options={[
                { value: '5', label: '5 miles' },
                { value: '10', label: '10 miles' },
                { value: '15', label: '15 miles' },
                { value: '20', label: '20 miles' },
                { value: '25', label: '25 miles' }
              ]}
              disabled={!isEditing}
            />
          </BaseCard>
        </div>
      </div>
    </div>
  );
} 
