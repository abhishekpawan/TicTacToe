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
  const { data, error } = await supabase
    .from('game_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as GameStats;
};

export const updateGameStats = async (userId: string, stats: Partial<GameStats>): Promise<GameStats | null> => {
  // First check if stats exist
  const existing = await getUserGameStats(userId);

  if (!existing) {
    // Create new stats record
    const { data, error } = await supabase
      .from('game_stats')
      .insert([{ user_id: userId, games_played: 0, games_won: 0, games_lost: 0, games_tied: 0, ...stats }])
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as GameStats;
  }

  // Update existing stats
  const { data, error } = await supabase
    .from('game_stats')
    .update(stats)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data as GameStats;
}; 