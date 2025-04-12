-- Schema for game_stats table

CREATE TABLE IF NOT EXISTS game_stats (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  games_played INTEGER NOT NULL DEFAULT 0,
  games_won INTEGER NOT NULL DEFAULT 0,
  games_lost INTEGER NOT NULL DEFAULT 0,
  games_tied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_game_stats_user_id ON game_stats(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_stats_modified
BEFORE UPDATE ON game_stats
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Example usage:

-- Insert a new stats record
-- INSERT INTO game_stats (user_id, games_played, games_won, games_lost, games_tied)
-- VALUES ('user-uuid', 10, 5, 3, 2);

-- Update stats for a user
-- UPDATE game_stats
-- SET games_played = games_played + 1, games_won = games_won + 1
-- WHERE user_id = 'user-uuid'; 