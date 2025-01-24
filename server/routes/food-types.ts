import { Router } from 'express';
import { supabase } from '../../lib/db/supabase';

const router = Router();

// GET /food-types - List all food types
router.get('/', async (req, res) => {
  try {
    console.log('Fetching food types from database...');
    const { data: foodTypes, error } = await supabase
      .from('food_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching food types:', error);
      throw error;
    }

    console.log('Found food types:', foodTypes);
    res.json({ foodTypes });
  } catch (error) {
    console.error('Error fetching food types:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch food types'
      }
    });
  }
});

export const foodTypesRouter = router; 