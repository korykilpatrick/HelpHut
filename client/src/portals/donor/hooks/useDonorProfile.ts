import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/api';
import { useAuth } from '../../../core/auth/useAuth';

export function useDonorProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['donorProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No user found');
      }
      
      try {
        // Get all donors and find the one matching the current user
        console.log('Fetching donors list for user:', user.id);
        const response = await api.donors.list();
        const donors = response.data.donors;
        
        console.log('Received donors:', donors);
        
        if (!Array.isArray(donors)) {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response from server');
        }
        
        const donor = donors.find(d => {
          console.log('Checking donor:', d);
          return d.userId === user.id;
        });
        
        if (!donor) {
          console.error('No donor found for user:', user.id);
          throw new Error('No donor profile found. Please contact support.');
        }
        
        console.log('Found donor profile:', donor);
        return donor;
      } catch (error) {
        console.error('Error fetching donor profile:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });
} 