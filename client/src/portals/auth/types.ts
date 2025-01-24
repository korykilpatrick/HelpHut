import { z } from 'zod';

// Base schema for all signups
export const baseSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Donor', 'Volunteer', 'Partner']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Donor-specific schema
export const donorSignupSchema = baseSignupSchema.extend({
  role: z.literal('Donor'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+\-\(\)\s]{7,}$/, 'Invalid phone number format'),
  businessHours: z.string().optional(),
});

// Volunteer-specific schema
export const volunteerSignupSchema = baseSignupSchema.extend({
  role: z.literal('Volunteer'),
  phone: z.string().regex(/^[0-9+\-\(\)\s]{7,}$/, 'Invalid phone number format'),
  vehicleType: z.string().optional(),
});

// Partner-specific schema
export const partnerSignupSchema = baseSignupSchema.extend({
  role: z.literal('Partner'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+\-\(\)\s]{7,}$/, 'Invalid phone number format'),
});

// Union type for all possible signup data
export type SignupData = 
  | z.infer<typeof donorSignupSchema>
  | z.infer<typeof volunteerSignupSchema>
  | z.infer<typeof partnerSignupSchema>;

// Helper to get the correct schema based on role
export const getSignupSchema = (role: string) => {
  switch (role) {
    case 'Donor':
      return donorSignupSchema;
    case 'Volunteer':
      return volunteerSignupSchema;
    case 'Partner':
      return partnerSignupSchema;
    default:
      return baseSignupSchema;
  }
}; 