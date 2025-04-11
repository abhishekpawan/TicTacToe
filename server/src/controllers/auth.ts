import { Request, Response } from 'express';
import { supabase } from '../index.js';
import { createUser, getUserById } from '../models/User.js';

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // The user should be attached from the auth middleware
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await getUserById(req.user.id);
    return res.json({ user });
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Create user in our database too
    if (data.user) {
      await createUser({
        id: data.user.id,
        email: data.user.email || '',
        username,
        created_at: new Date().toISOString(),
      });
    }
    
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Sign in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    
    // Return the session
    return res.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; 