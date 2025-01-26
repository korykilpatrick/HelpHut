import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Input } from '../../../shared/components/inputs/Input';
import { Select } from '../../../shared/components/inputs/Select';
import { toast } from '../../../shared/components/toast';

interface CoverageZone {
  id: string;
  name: string;
  zipCode: string;
  radius: number;
  status: 'active' | 'inactive';
  deliveryCount: number;
  lastDelivery?: string;
}

export function CoverageAreasPage() {
  const queryClient = useQueryClient();
  const [newZoneName, setNewZoneName] = React.useState('');
  const [newZipCode, setNewZipCode] = React.useState('');
  const [newRadius, setNewRadius] = React.useState('5');
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Fetch coverage zones
  const { data: zones, isLoading } = useQuery({
    queryKey: ['coverageZones'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return [
          {
            id: '1',
            name: 'Downtown Austin',
            zipCode: '78701',
            radius: 5,
            status: 'active',
            deliveryCount: 24,
            lastDelivery: '2024-01-20T14:30:00Z'
          },
          {
            id: '2',
            name: 'South Austin',
            zipCode: '78704',
            radius: 3,
            status: 'active',
            deliveryCount: 18,
            lastDelivery: '2024-01-18T16:00:00Z'
          },
          {
            id: '3',
            name: 'North Austin',
            zipCode: '78758',
            radius: 4,
            status: 'inactive',
            deliveryCount: 6,
            lastDelivery: '2023-12-15T10:00:00Z'
          }
        ] as CoverageZone[];
      } catch (error) {
        console.error('Error fetching coverage zones:', error);
        throw error;
      }
    }
  });

  // Add zone mutation
  const addZoneMutation = useMutation({
    mutationFn: async (zone: Omit<CoverageZone, 'id' | 'deliveryCount' | 'lastDelivery' | 'status'>) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverageZones'] });
      toast.success('Coverage zone added successfully!');
      setShowAddForm(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error adding coverage zone:', error);
      toast.error('Failed to add coverage zone. Please try again.');
    }
  });

  // Toggle zone status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverageZones'] });
      toast.success('Zone status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating zone status:', error);
      toast.error('Failed to update zone status. Please try again.');
    }
  });

  // Delete zone mutation
  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverageZones'] });
      toast.success('Coverage zone deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting coverage zone:', error);
      toast.error('Failed to delete coverage zone. Please try again.');
    }
  });

  const resetForm = () => {
    setNewZoneName('');
    setNewZipCode('');
    setNewRadius('5');
  };

  const handleAddZone = () => {
    if (!newZoneName || !newZipCode || !newRadius) {
      toast.error('Please fill in all fields');
      return;
    }

    addZoneMutation.mutate({
      name: newZoneName,
      zipCode: newZipCode,
      radius: parseInt(newRadius)
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Coverage Areas</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your preferred food rescue delivery zones
        </p>
      </div>

      {/* Add Zone Button */}
      {!showAddForm && (
        <BaseButton
          variant="default"
          size="lg"
          className="mb-8"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Coverage Zone
        </BaseButton>
      )}

      {/* Add Zone Form */}
      {showAddForm && (
        <BaseCard className="mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Add New Coverage Zone</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Zone Name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g. Downtown Austin"
              />
              <Input
                label="ZIP Code"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                placeholder="e.g. 78701"
              />
            </div>
            <div className="sm:w-48">
              <Select
                label="Radius (miles)"
                value={newRadius}
                onChange={(e) => setNewRadius(e.target.value)}
                options={[
                  { value: '3', label: '3 miles' },
                  { value: '4', label: '4 miles' },
                  { value: '5', label: '5 miles' },
                  { value: '6', label: '6 miles' },
                  { value: '7', label: '7 miles' }
                ]}
              />
            </div>
            <div className="flex gap-2">
              <BaseButton
                variant="default"
                onClick={handleAddZone}
                disabled={addZoneMutation.isPending}
              >
                Add Zone
              </BaseButton>
              <BaseButton
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Cancel
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      )}

      {/* Coverage Zones List */}
      <div className="space-y-4">
        {zones?.map((zone) => (
          <BaseCard
            key={zone.id}
            variant="elevated"
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge
                    variant={zone.status === 'active' ? 'success' : 'default'}
                    icon={zone.status === 'active' ? 
                      <CheckCircle2 className="h-3.5 w-3.5" /> : 
                      <AlertCircle className="h-3.5 w-3.5" />
                    }
                  >
                    {zone.status === 'active' ? 'Active' : 'Inactive'}
                  </BaseBadge>
                  <BaseText size="lg" weight="medium" truncate>
                    {zone.name}
                  </BaseText>
                </div>

                {/* Details */}
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted">
                      {zone.zipCode} • {zone.radius} miles
                    </BaseText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted">
                      {zone.deliveryCount} deliveries
                    </BaseText>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted">
                      Last: {formatDate(zone.lastDelivery)}
                    </BaseText>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <BaseButton
                  variant={zone.status === 'active' ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => toggleStatusMutation.mutate({
                    id: zone.id,
                    status: zone.status === 'active' ? 'inactive' : 'active'
                  })}
                  disabled={toggleStatusMutation.isPending}
                >
                  {zone.status === 'active' ? 'Deactivate' : 'Activate'}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteZoneMutation.mutate(zone.id)}
                  disabled={deleteZoneMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        ))}

        {/* Empty State */}
        {(!zones || zones.length === 0) && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <BaseText variant="muted" className="mt-4">
              No coverage zones defined
            </BaseText>
            <BaseText size="sm" variant="muted" className="mt-1">
              Add a zone to start receiving delivery assignments in your area
            </BaseText>
            <BaseButton
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Zone
            </BaseButton>
          </div>
        )}
      </div>
    </div>
  );
} 