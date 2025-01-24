import { Router } from 'express';
import { supabaseAuth, supabase } from '../../lib/db/supabase.js';

const router = Router();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: minimum 6 characters
const PASSWORD_MIN_LENGTH = 6;

// Valid user roles
const USER_ROLES = ['Admin', 'Donor', 'Volunteer', 'Partner'] as const;
type UserRole = typeof USER_ROLES[number];

// Login with email and password
router.post('/login', async (req, res) => {
  console.log('Received login request:', {
    ...req.body,
    password: '[REDACTED]'
  });

  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('Missing required fields:', { email: !!email, password: !!password });
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    console.log('Attempting Supabase auth login...');
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }
    console.log('Auth successful for user:', { id: data.user.id, email: data.user.email });

    // Get additional user data
    console.log('Fetching user profile...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      throw userError;
    }
    console.log('User profile fetched:', { id: userData.id, role: userData.role });

    // Get organization data based on role
    let orgData;
    if (userData.role === 'Donor') {
      console.log('Fetching donor organization data...');
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (donorError) {
        if (donorError.code === 'PGRST116') { // Not found
          console.log('No donor record found, creating placeholder...');
          const { data: newDonor, error: createError } = await supabase
            .from('donors')
            .insert({
              user_id: userData.id,
              organization_name: userData.display_name,
              phone: '0000000000'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder donor record:', createError);
            throw createError;
          }
          orgData = newDonor;
          console.log('Created placeholder donor record:', { id: newDonor.id });
        } else {
          console.error('Error fetching donor data:', donorError);
          throw donorError;
        }
      } else {
        orgData = donorData;
        console.log('Donor data fetched:', { id: donorData.id, organization: donorData.organization_name });
      }
    } else if (userData.role === 'Volunteer') {
      console.log('Fetching volunteer data...');
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      if (volunteerError) {
        console.error('Error fetching volunteer data:', volunteerError);
        throw volunteerError;
      }
      orgData = volunteerData;
      console.log('Volunteer data fetched:', { id: volunteerData.id });
    } else if (userData.role === 'Partner') {
      console.log('Fetching partner organization data...');
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      if (partnerError) {
        console.error('Error fetching partner data:', partnerError);
        throw partnerError;
      }
      orgData = partnerData;
      console.log('Partner data fetched:', { id: partnerData.id, name: partnerData.name });
    }

    console.log('Login completed successfully');
    return res.json({
      user: {
        ...data.user,
        ...userData,
        organization: orgData
      },
      session: data.session
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(401).json({ error: error.message });
  }
});

// Sign up with email and password
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', {
    ...req.body,
    password: '[REDACTED]'
  });

  const { email, password, role: rawRole, name, organization_name, phone, business_hours } = req.body;
  
  // Validate and normalize role
  const role = (rawRole as string).charAt(0).toUpperCase() + (rawRole as string).slice(1).toLowerCase();
  console.log('Normalized role:', role);

  if (!USER_ROLES.includes(role as UserRole)) {
    console.log('Invalid role:', role);
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Validate required fields based on role
  if (!email || !password || !role || !name) {
    console.log('Missing required fields:', { email: !!email, password: !!password, role: !!role, name: !!name });
    return res.status(400).json({ error: 'Email, password, role, and name are required' });
  }

  if (role === 'Donor' && !organization_name) {
    console.log('Missing organization name for donor');
    return res.status(400).json({ error: 'Organization name is required for donors' });
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    console.log('Invalid email format:', email);
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < PASSWORD_MIN_LENGTH) {
    console.log('Password too short');
    return res.status(400).json({ 
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` 
    });
  }

  try {
    // Create Supabase auth user with metadata
    console.log('Creating Supabase auth user...', {
      email,
      metadata: {
        name,
        role
      }
    });
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // This will become display_name via trigger
          role
        }
      }
    });

    if (authError) {
      console.error('Supabase auth error:', {
        message: authError.message,
        status: authError.status,
        name: authError.name,
        details: authError
      });
      throw authError;
    }
    if (!authData.user) {
      console.error('No user returned from Supabase auth');
      throw new Error('Failed to create user');
    }
    console.log('Auth user created:', { 
      id: authData.user.id, 
      email: authData.user.email,
      metadata: authData.user.user_metadata 
    });

    // Wait for the user record to be created by the trigger
    console.log('Waiting for user profile to be created by trigger...', {
      userId: authData.user.id
    });
    let userData;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (error) {
        console.log(`Attempt ${attempts + 1} error:`, error);
      }
      
      if (data) {
        userData = data;
        console.log('User profile found:', { 
          id: userData.id, 
          role: userData.role,
          display_name: userData.display_name 
        });
        break;
      }
      
      console.log(`User profile not found yet, attempt ${attempts + 1} of ${maxAttempts}`, {
        lastError: error
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!userData) {
      console.error('User profile was not created in time', {
        userId: authData.user.id,
        attempts,
        metadata: authData.user.user_metadata
      });
      await supabaseAuth.auth.admin.deleteUser(authData.user.id);
      throw new Error('Failed to create user profile');
    }

    // Create or update organization-specific record
    if (role === 'Donor') {
      console.log('Creating donor record...');
      const { error: donorError } = await supabase
        .from('donors')
        .upsert({
          user_id: userData.id,
          organization_name: organization_name,
          phone,
          business_hours
        });

      if (donorError) {
        console.error('Error creating donor record:', donorError);
        throw donorError;
      }
      console.log('Donor record created successfully');
    }

    console.log('Signup completed successfully');
    return res.json({
      message: 'Account created successfully',
      user: {
        ...authData.user,
        ...userData,
        organization: userData
      },
      session: authData.session
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

    // Get additional user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;

    // Get organization data based on role
    let orgData;
    if (userData.role === 'Donor') {
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (donorError) {
        if (donorError.code === 'PGRST116') { // Not found
          console.log('No donor record found in session, creating placeholder...');
          const { data: newDonor, error: createError } = await supabase
            .from('donors')
            .insert({
              user_id: userData.id,
              organization_name: userData.display_name,
              phone: '0000000000'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder donor record:', createError);
            throw createError;
          }
          orgData = newDonor;
          console.log('Created placeholder donor record:', { id: newDonor.id });
        } else {
          console.error('Error fetching donor data:', donorError);
          throw donorError;
        }
      } else {
        orgData = donorData;
        console.log('Donor data fetched:', { id: donorData.id, organization: donorData.organization_name });
      }
    }
    // Add similar blocks for other roles

    return res.json({ 
      user: {
        ...session.user,
        ...userData,
        donor: orgData // Use donor field to match AuthProvider expectations
      },
      session: {
        token: session.access_token // Include the token in the expected format
      }
    });
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