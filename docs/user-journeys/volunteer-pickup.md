# Volunteer Pickup Journey

## Overview
This document outlines the technical implementation of HelpHut's volunteer pickup workflow, which enables volunteers to view available donations, claim pickups, and complete deliveries.

## Technical Flow

### 1. Available Pickups View
**File**: `client/src/portals/volunteer/pages/AvailablePickupsPage.tsx`

#### Component Structure:
```typescript
interface AvailablePickup {
  id: string;
  donorName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  foodType: string;
  quantity: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
  requirements: {
    refrigeration: boolean;
    freezing: boolean;
    heavyLifting: boolean;
  };
}
```

#### Key Features:
1. **Search & Filtering**:
   - Location-based search
   - Urgency filtering (Standard, Time-Sensitive, Urgent)
   - Distance-based sorting

2. **Pickup Details Display**:
   - Donor information
   - Pickup/delivery locations
   - Time windows
   - Food type and quantity
   - Special handling requirements

3. **Claim Functionality**:
   ```typescript
   const claimMutation = useMutation({
     mutationFn: async (pickupId: string) => {
       return api.donations.claimDonation(pickupId);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['availablePickups'] });
       toast.success('Pickup claimed successfully!');
     }
   });
   ```

### 2. Active Deliveries Dashboard
**File**: `client/src/portals/volunteer/pages/DashboardPage.tsx`

#### Status Tracking:
The system tracks donations through the following states:
- `Submitted`: Initial state after donor submission
- `Scheduled`: Claimed by volunteer
- `InTransit`: Pickup confirmed, en route
- `Delivered`: Dropped off at partner
- `Completed`: Delivery confirmed by partner

#### Implementation:
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Scheduled':
    case 'InTransit':
      return 'primary';
    default:
      return 'warning';
  }
};
```

### 3. Delivery Confirmation
**File**: `client/src/portals/volunteer/pages/DeliveryHistoryPage.tsx`

#### Delivery Record Structure:
```typescript
interface DeliveryRecord {
  id: string;
  date: string;
  pickupLocation: string;
  deliveryLocation: string;
  foodType: string;
  quantity: string;
  impact: {
    mealsProvided: number;
    carbonSaved: number;
  };
  rating?: {
    score: number;
    feedback?: string;
  };
}
```

### 4. Partner Coordination
**File**: `client/src/portals/partner/pages/DeliverySchedulePage.tsx`

#### Delivery Schedule Interface:
```typescript
interface DeliverySchedule {
  id: string;
  donationId: string;
  expectedDeliveryTime: string;
  status: 'scheduled' | 'in_transit' | 'completed' | 'delayed';
  donorName: string;
  foodType: string;
  quantity: string;
  handlingInstructions?: string;
  volunteerName?: string;
  estimatedArrivalTime?: string;
}
```

## Status Update Flow

1. **Claim Pickup**:
   - Volunteer claims available donation
   - Status changes to `Scheduled`
   - Notification sent to donor

2. **Start Pickup**:
   - Volunteer confirms pickup start
   - Status changes to `InTransit`
   - Partner notified of incoming delivery

3. **Complete Delivery**:
   - Volunteer marks delivery complete
   - Partner confirms receipt
   - Status changes to `Completed`
   - Impact metrics updated

## Error Handling

1. **Claim Conflicts**:
   - Concurrent claim protection
   - Automatic release of expired claims
   - User-friendly error messages

2. **Status Update Failures**:
   - Retry mechanisms
   - Fallback offline updates
   - Sync resolution on reconnection

## Related Files
- `client/src/portals/volunteer/pages/AvailablePickupsPage.tsx`
- `client/src/portals/volunteer/pages/DashboardPage.tsx`
- `client/src/portals/volunteer/pages/DeliveryHistoryPage.tsx`
- `client/src/portals/partner/pages/DeliverySchedulePage.tsx`
- `lib/api/impl/donations.ts`
- `lib/types/generated/api.ts`

## Security Considerations
1. **Access Control**:
   - Route protection for volunteer-only pages
   - Validation of volunteer status
   - Verification of claim ownership

2. **Data Privacy**:
   - Limited exposure of donor details
   - Secure handling of location data
   - Audit logging of status changes 