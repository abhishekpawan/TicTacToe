import { supabase } from '../index.js';

export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  last_sign_in_at?: string | null;
}

export interface GameStats {
  user_id: string;
  games_played: number;
  games_won: number;
  games_lost: number;
  games_tied: number;
}

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
};

export const createUser = async (user: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
};

export const getUserGameStats = async (userId: string): Promise<GameStats | null> => {
  console.log('Getting game stats for user:', userId);
  try {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Check specifically for the "no rows" error which isn't really an error for us
      if (error.code === 'PGRST116' && error.details === 'The result contains 0 rows') {
        console.log('No stats record exists yet for user:', userId);
        return null;
      }
      
      console.error('Error getting game stats:', error);
      return null;
    }

    if (!data) {
      console.log('No game stats found for user:', userId);
      return null;
    }

    console.log('Found game stats:', data);
    return data as GameStats;
  } catch (error) {
    console.error('Unexpected error getting game stats:', error);
    return null;
  }
};

export const updateGameStats = async (userId: string, stats: Partial<GameStats>): Promise<GameStats | null> => {
  console.log('Updating game stats for user:', userId, 'with stats:', stats);
  try {
    // First check if stats exist
    const existing = await getUserGameStats(userId);

    if (!existing) {
      console.log('No existing stats, creating new record');
      // Create new stats record
      const defaultStats = { 
        user_id: userId, 
        games_played: 0, 
        games_won: 0, 
        games_lost: 0, 
        games_tied: 0,
        ...stats 
      };
      console.log('Default stats to insert:', defaultStats);
      
      try {
        const { data, error } = await supabase
          .from('game_stats')
          .insert([defaultStats])
          .select()
          .single();

        if (error) {
          console.error('Error creating game stats:', error);
          return null;
        }

        if (!data) {
          console.log('No data returned after insert');
          return null;
        }

        console.log('Created new stats record:', data);
        return data as GameStats;
      } catch (insertError) {
        console.error('Error during insert operation:', insertError);
        return null;
      }
    }

    console.log('Updating existing stats:', existing);
    // Calculate new stats by adding the values
    const updatedStats = { 
      games_played: (existing.games_played || 0) + (stats.games_played || 0), 
      games_won: (existing.games_won || 0) + (stats.games_won || 0),
      games_lost: (existing.games_lost || 0) + (stats.games_lost || 0),
      games_tied: (existing.games_tied || 0) + (stats.games_tied || 0)
    };
    console.log('Calculated updated stats:', updatedStats);

    // Update existing stats
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .update(updatedStats)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating game stats:', error);
        return null;
      }

      if (!data) {
        console.log('No data returned after update');
        return null;
      }

      console.log('Updated stats:', data);
      return data as GameStats;
    } catch (updateError) {
      console.error('Error during update operation:', updateError);
      return null;
    }
  } catch (error) {
    console.error('Unexpected error in updateGameStats:', error);
    return null;
  }
}; 