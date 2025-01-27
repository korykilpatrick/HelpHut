# Donor Submission Journey

## Overview
This document outlines the technical implementation of the donation submission process in HelpHut, from the donor's dashboard to the creation of a donation ticket.

## Technical Flow

### 1. Entry Point: Dashboard
**File**: `client/src/portals/donor/pages/DashboardPage.tsx`
```typescript
// Quick action button that initiates the flow
<BaseButton onClick={() => navigate('/donor/donate')}>
  Submit New Donation
</BaseButton>
```

### 2. Donation Submission Page
**File**: `client/src/portals/donor/pages/DonationSubmissionPage.tsx`

#### Key Components:
- Uses `useDonorProfile` hook for donor information
- Implements React Query mutation for form submission
- Handles success/error states and navigation

#### Data Flow:
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const donationData = {
      donorId: donorProfile.id,
      foodTypeId: data.foodType,
      quantity: Number(data.quantity.amount),
      unit: data.quantity.unit,
      pickupWindowStart: new Date(data.pickupWindow.startTime),
      pickupWindowEnd: new Date(data.pickupWindow.endTime),
      requiresRefrigeration: Boolean(data.handlingRequirements.refrigeration),
      requiresFreezing: Boolean(data.handlingRequirements.freezing),
      isFragile: Boolean(data.handlingRequirements.fragile),
      requiresHeavyLifting: Boolean(data.handlingRequirements.heavyLifting),
      notes: data.notes || ''
    };
    return api.donations.createDonation(donationData);
  }
});
```

### 3. Donation Form Component
**File**: `client/src/portals/donor/components/DonationForm.tsx`

#### Form Sections:
1. **Food Information**
   - Food Type (dropdown)
   - Quantity and Unit selection

2. **Handling Requirements**
   - Refrigeration needed
   - Freezing needed
   - Fragile items
   - Heavy lifting required

3. **Pickup Window**
   - Start time
   - End time

4. **Additional Notes**
   - Optional text area for special instructions

#### Validation Schema:
```typescript
const donationSchema = z.object({
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
  notes: z.string().optional()
});
```

### 4. Backend Processing
**File**: `lib/api/impl/donations.ts`

#### Creation Process:
1. Validates pickup window times
2. Transforms data to snake_case for database
3. Creates donation record
4. Automatically generates a ticket

```typescript
async createDonation(donation: DonationCreate): Promise<Donation> {
  // Validation
  const pickupStart = new Date(donation.pickupWindowStart);
  const pickupEnd = new Date(donation.pickupWindowEnd);
  if (pickupStart >= pickupEnd) {
    throw new DonationValidationError('Pickup window end time must be after start time');
  }

  // Database insertion
  const insertData = {
    donor_id: donation.donorId,
    food_type_id: donation.foodTypeId,
    quantity: donation.quantity,
    unit: donation.unit,
    // ... other fields
  };

  const { data, error } = await this.db
    .from('donations')
    .insert(insertData)
    .select()
    .single();
}
```

### 5. Automatic Ticket Creation
- A ticket is automatically created when a donation is submitted
- Ticket creation is handled in the same transaction as donation creation
- Enables immediate volunteer matching

### 6. Post-Submission Flow
1. Success:
   - Shows success toast notification
   - Redirects to donation history page
   - Ticket becomes available in volunteer portal

2. Error Handling:
   - Validation errors shown inline
   - Network/server errors shown via toast
   - Form remains populated for retry

## Related Files
- `client/src/portals/donor/pages/DashboardPage.tsx`
- `client/src/portals/donor/pages/DonationSubmissionPage.tsx`
- `client/src/portals/donor/components/DonationForm.tsx`
- `lib/api/impl/donations.ts`
- `lib/types/generated/api.ts`

## Database Tables
- `donations`
- `food_types`
- `tickets`

## API Endpoints
- POST `/donations`
- POST `/donors/{donorId}/donations` 