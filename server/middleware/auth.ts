import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAuth } from '../../lib/db/supabase';
import type { Database } from '../../lib/db/types';
import type { User as AuthUser } from '@supabase/supabase-js';

type User = AuthUser & {
  role: string;
};

// Extend the Request type to include our user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found in Authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Verifying token...');

    // Verify the token with Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get additional user data from the database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      console.error('Error fetching user data:', dbError);
      return res.status(401).json({ error: 'Failed to fetch user data' });
    }

    // Attach the user to the request
    req.user = {
      ...user,
      role: dbUser.role
    };
    console.log('User authenticated:', { id: req.user.id, role: dbUser.role });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
