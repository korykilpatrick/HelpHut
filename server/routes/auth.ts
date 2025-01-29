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
  console.log('=== Login Request Started ===');
  try {
    const { email, password } = req.body;
    console.log('-> Authenticating user:', email);

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get additional user data
    console.log('-> Getting user data for:', data.user.id);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;
    console.log('-> User data fetched:', userData);

    // Get organization data based on role
    let orgData;
    if (userData.role === 'Donor') {
      console.log('-> Fetching donor organization data');
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select(`
          id,
          user_id,
          organization_name,
          phone,
          created_at,
          updated_at
        `)
        .eq('user_id', userData.id)
        .single();
      
      if (donorError) {
        if (donorError.code === 'PGRST116') { // Not found
          console.log('-> No donor record found, creating placeholder...');
          const { data: newDonor, error: createError } = await supabase
            .from('donors')
            .insert({
              user_id: userData.id,
              organization_name: userData.display_name || 'Unknown Organization',
              phone: '0000000000'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder donor record:', createError);
            throw createError;
          }
          orgData = newDonor;
          console.log('-> Created placeholder donor record:', JSON.stringify(orgData, null, 2));
        } else {
          console.error('Error fetching donor data:', donorError);
          throw donorError;
        }
      } else {
        orgData = donorData;
        console.log('-> Donor data fetched:', JSON.stringify(orgData, null, 2));
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
        if (partnerError.code === 'PGRST116') { // Not found
          console.log('No partner record found, creating placeholder...');
          const email = data.user?.email;
          if (!email) {
            throw new Error('User email is required for partner record');
          }

          const { data: newPartner, error: createError } = await supabase
            .from('partners')
            .insert({
              name: userData.display_name,
              contact_email: email,
              contact_phone: '0000000000',
              max_capacity: 0,
              capacity: 0,
              user_id: userData.id
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder partner record:', createError);
            throw createError;
          }
          orgData = newPartner;
          console.log('Created placeholder partner record:', { id: newPartner.id });
        } else {
          console.error('Error fetching partner data:', partnerError);
          throw partnerError;
        }
      } else {
        orgData = partnerData;
        console.log('Partner data fetched:', { id: partnerData.id, name: partnerData.name });
      }
    }

    // Get the organization name based on role
    let organizationName = undefined;
    if (userData.role === 'Donor' && orgData && 'organization_name' in orgData) {
      organizationName = orgData.organization_name;
      console.log('-> Setting donor organization name:', organizationName);
    } else if (userData.role === 'Partner' && orgData && 'name' in orgData) {
      organizationName = orgData.name;
      console.log('-> Setting partner organization name:', organizationName);
    }

    const response = {
      user: {
        ...data.user,
        ...userData,
        name: userData.display_name,
        role: userData.role.toLowerCase(),
        organizationName,
        donor: userData.role === 'Donor' ? orgData : undefined,
        partner: userData.role === 'Partner' ? orgData : undefined,
        volunteer: userData.role === 'Volunteer' ? orgData : undefined
      },
      session: {
        token: data.session.access_token
      }
    };

    console.log('-> Sending login response:', JSON.stringify(response, null, 2));
    console.log('=== Login Request Completed ===');
    
    return res.json(response);
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
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!userData) {
      throw new Error('Failed to find user profile after signup');
    }

    // Create organization record based on role
    if (role === 'Donor') {
      console.log('Creating donor record...');
      const { error: donorError } = await supabase
        .from('donors')
        .insert({
          user_id: authData.user.id,
          organization_name: organization_name || name,
          phone: phone || '0000000000',
          business_hours: business_hours || null
        });
      
      if (donorError) {
        console.error('Error creating donor record:', donorError);
        throw donorError;
      }
    } else if (role === 'Volunteer') {
      console.log('Creating volunteer record...');
      const { error: volunteerError } = await supabase
        .from('volunteers')
        .insert({
          user_id: authData.user.id,
          phone: phone || '0000000000',
          vehicle_type: req.body.vehicle_type || null
        });
      
      if (volunteerError) {
        console.error('Error creating volunteer record:', volunteerError);
        throw volunteerError;
      }
    } else if (role === 'Partner') {
      console.log('Creating partner record...');
      const email = req.body.contact_email.trim();
      console.log('Contact email value:', JSON.stringify(req.body.contact_email));
      
      // Test with a simpler pattern that matches PostgreSQL's behavior
      const { error: partnerError } = await supabase
        .from('partners')
        .insert({
          user_id: authData.user.id,
          name: organization_name || name,
          contact_email: email.toLowerCase(), // ensure case-insensitive match
          contact_phone: phone || '0000000000',
          max_capacity: 0,
          capacity: 0
        });
      
      if (partnerError) {
        console.error('Error creating partner record:', partnerError);
        throw partnerError;
      }
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
        .select(`
          id,
          user_id,
          organization_name,
          phone,
          created_at,
          updated_at
        `)
        .eq('user_id', userData.id)
        .single();
      
      if (donorError) {
        if (donorError.code === 'PGRST116') { // Not found
          console.log('No donor record found in session, creating placeholder...');
          const { data: newDonor, error: createError } = await supabase
            .from('donors')
            .insert({
              user_id: userData.id,
              organization_name: userData.display_name || 'Unknown Organization',
              phone: '0000000000'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder donor record:', createError);
            throw createError;
          }
          orgData = newDonor;
        } else {
          console.error('Error fetching donor data:', donorError);
          throw donorError;
        }
      } else {
        orgData = donorData;
      }
    } else if (userData.role === 'Partner') {
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (partnerError) {
        if (partnerError.code === 'PGRST116') { // Not found
          console.log('No partner record found in session, creating placeholder...');
          if (!session.user.email) {
            throw new Error('User email is required for partner record');
          }
          const partnerInsert = {
            user_id: userData.id,
            name: userData.display_name || 'Unknown Organization',
            contact_email: session.user.email,
            contact_phone: '0000000000',
            max_capacity: 0,
            capacity: 0
          } as const;
          const { data: newPartner, error: createError } = await supabase
            .from('partners')
            .insert(partnerInsert)
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating placeholder partner record:', createError);
            throw createError;
          }
          orgData = newPartner;
        } else {
          console.error('Error fetching partner data:', partnerError);
          throw partnerError;
        }
      } else {
        orgData = partnerData;
      }
    } else if (userData.role === 'Volunteer') {
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', userData.id)
        .single();
      
      if (volunteerError && volunteerError.code !== 'PGRST116') {
        console.error('Error fetching volunteer data:', volunteerError);
        throw volunteerError;
      }
      orgData = volunteerData || null;
    }

    // Get the organization name based on role
    let organizationName = undefined;
    if (userData.role === 'Donor' && orgData && 'organization_name' in orgData) {
      organizationName = orgData.organization_name;
    } else if (userData.role === 'Partner' && orgData && 'name' in orgData) {
      organizationName = orgData.name;
    }

    console.log('Organization name fetched:', organizationName);

    return res.json({ 
      user: {
        ...session.user,
        ...userData,
        name: userData.display_name,
        role: userData.role.toLowerCase(),
        organizationName,
        donor: userData.role === 'Donor' ? orgData : undefined,
        partner: userData.role === 'Partner' ? orgData : undefined,
        volunteer: userData.role === 'Volunteer' ? orgData : undefined
      },
      session: {
        token: session.access_token
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