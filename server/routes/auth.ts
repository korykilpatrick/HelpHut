import { Router } from 'express';
import { supabaseAuth } from '../../lib/db/supabase.js';

const router = Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: minimum 6 characters
const PASSWORD_MIN_LENGTH = 6;

// Login with email and password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure we're sending back the complete session data
    return res.json({
      user: data.user,
      session: {
        token: data.session?.access_token,
        ...data.session
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(401).json({ error: error.message });
  }
});

// Sign up with email and password
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ 
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` 
    });
  }

  try {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          email_confirmed: false,
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    // If no session is returned, email confirmation is required
    if (!data.session) {
      return res.json({
        message: 'Please check your email for confirmation link',
        user: data.user,
      });
    }

    return res.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(400).json({ 
      error: error.message || 'Failed to create account' 
    });
  }
});

// Get current session
router.get('/session', async (req, res) => {
  try {
    const { data: { session }, error } = await supabaseAuth.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      return res.status(401).json({ error: 'No active session' });
    }

    return res.json({ session });
  } catch (error: any) {
    console.error('Session error:', error);
    return res.status(400).json({ error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabaseAuth.auth.signOut();
    if (error) throw error;
    return res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return res.status(400).json({ error: error.message });
  }
});

export default router; 