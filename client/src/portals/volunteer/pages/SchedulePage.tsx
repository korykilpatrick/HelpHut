import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Package,
  AlertCircle,
  X
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Input } from '../../../shared/components/inputs/Input';
import { Select } from '../../../shared/components/inputs/Select';
import { Checkbox } from '../../../shared/components/inputs/Checkbox';
import { FormSection } from '../../../shared/components/forms/FormSection';
import { toast } from '../../../shared/components/toast';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ScheduledShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  foodType: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

const timeSlots = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00'
] as const;

export function SchedulePage() {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = React.useState<string>(daysOfWeek[0]);

  // Fetch current availability
  const { data: availability, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ['volunteerAvailability'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          timeSlots: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '10:00', endTime: '15:00' },
            { day: 'Friday', startTime: '14:00', endTime: '18:00' }
          ] as TimeSlot[]
        };
      } catch (error) {
        console.error('Error fetching availability:', error);
        throw error;
      }
    }
  });

  // Fetch scheduled shifts
  const { data: shifts, isLoading: isShiftsLoading } = useQuery({
    queryKey: ['scheduledShifts'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return [
          {
            id: '1',
            date: '2024-01-26',
            startTime: '10:00',
            endTime: '12:00',
            pickupLocation: 'Central Market Downtown',
            deliveryLocation: 'Austin Food Bank',
            foodType: 'Produce',
            status: 'scheduled'
          },
          {
            id: '2',
            date: '2024-01-27',
            startTime: '14:00',
            endTime: '16:00',
            pickupLocation: 'Whole Foods Market',
            deliveryLocation: 'Salvation Army',
            foodType: 'Prepared Meals',
            status: 'scheduled'
          }
        ] as ScheduledShift[];
      } catch (error) {
        console.error('Error fetching shifts:', error);
        throw error;
      }
    }
  });

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: async (timeSlot: TimeSlot) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerAvailability'] });
      toast.success('Availability updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability. Please try again.');
    }
  });

  // Cancel shift mutation
  const cancelShiftMutation = useMutation({
    mutationFn: async (shiftId: string) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledShifts'] });
      toast.success('Shift cancelled successfully!');
    },
    onError: (error: any) => {
      console.error('Error cancelling shift:', error);
      toast.error('Failed to cancel shift. Please try again.');
    }
  });

  const handleAddTimeSlot = (day: string, startTime: string, endTime: string) => {
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    updateAvailabilityMutation.mutate({ day, startTime, endTime });
  };

  const formatShiftDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatShiftTime = (date: string, time: string) => {
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    
    return dateObj.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Schedule Management</h1>
        <p className="mt-2 text-muted-foreground">
          Set your availability and manage your upcoming shifts
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Availability Section */}
        <BaseCard>
          <FormSection
            title="Weekly Availability"
            description="Set your regular weekly availability for food rescue shifts"
          >
            <div className="space-y-4">
              {/* Day Selection */}
              <Select
                label="Select Day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                options={daysOfWeek.map(day => ({
                  value: day,
                  label: day
                }))}
              />

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Start Time"
                  options={timeSlots.map(time => ({
                    value: time,
                    label: new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  }))}
                />
                <Select
                  label="End Time"
                  options={timeSlots.map(time => ({
                    value: time,
                    label: new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  }))}
                />
              </div>

              <BaseButton
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => handleAddTimeSlot(selectedDay, '09:00', '17:00')}
                disabled={updateAvailabilityMutation.isPending}
              >
                Add Time Slot
              </BaseButton>
            </div>

            {/* Current Availability */}
            <div className="mt-6 space-y-2">
              <BaseText weight="medium">Current Availability</BaseText>
              {availability?.timeSlots.map((slot) => (
                <div
                  key={`${slot.day}-${slot.startTime}-${slot.endTime}`}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <BaseText size="sm">
                      {slot.day}, {new Date(`2024-01-01T${slot.startTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })} - {new Date(`2024-01-01T${slot.endTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </BaseText>
                  </div>
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    onClick={() => updateAvailabilityMutation.mutate({ ...slot, startTime: '', endTime: '' })}
                  >
                    <X className="h-4 w-4" />
                  </BaseButton>
                </div>
              ))}
              {(!availability?.timeSlots || availability.timeSlots.length === 0) && (
                <BaseText size="sm" variant="muted">
                  No availability set
                </BaseText>
              )}
            </div>
          </FormSection>
        </BaseCard>

        {/* Upcoming Shifts */}
        <BaseCard>
          <FormSection
            title="Upcoming Shifts"
            description="View and manage your scheduled food rescue shifts"
          >
            <div className="space-y-4">
              {shifts?.map((shift) => (
                <div
                  key={shift.id}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  {/* Date and Time */}
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <BaseText size="sm" weight="medium">
                      {formatShiftDate(shift.date)}
                    </BaseText>
                    <BaseText size="sm" variant="muted">
                      {formatShiftTime(shift.date, shift.startTime)} - {formatShiftTime(shift.date, shift.endTime)}
                    </BaseText>
                  </div>

                  {/* Locations */}
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <BaseText size="sm" variant="muted" truncate>
                      {shift.pickupLocation} → {shift.deliveryLocation}
                    </BaseText>
                  </div>

                  {/* Food Type */}
                  <div className="mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <BaseText size="sm" variant="muted">
                      {shift.foodType}
                    </BaseText>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <BaseButton
                      variant="outline"
                      size="sm"
                      onClick={() => cancelShiftMutation.mutate(shift.id)}
                      disabled={cancelShiftMutation.isPending}
                    >
                      Cancel Shift
                    </BaseButton>
                    <BaseButton
                      variant="default"
                      size="sm"
                      onClick={() => {/* TODO: Navigate to shift details */}}
                    >
                      View Details
                    </BaseButton>
                  </div>
                </div>
              ))}
              {(!shifts || shifts.length === 0) && (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <BaseText variant="muted" className="mt-4">
                    No upcoming shifts
                  </BaseText>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {/* TODO: Navigate to available pickups */}}
                  >
                    Find Available Pickups
                  </BaseButton>
                </div>
              )}
            </div>
          </FormSection>
        </BaseCard>
      </div>
    </div>
  );
} 