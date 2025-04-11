import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gameAPI } from '../../services/api';

interface GameStats {
  games_played: number;
  games_won: number;
  games_lost: number;
  games_tied: number;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await gameAPI.getStats();
        if (response && response.data) {
          setStats(response.data as GameStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use void to explicitly mark the promise as ignored
    void fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return <div>Please login to view your profile</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      
      <div className="user-info">
        <p><strong>Email:</strong> {user.email || 'No email'}</p>
        {user.user_metadata?.username && (
          <p><strong>Username:</strong> {user.user_metadata.username}</p>
        )}
      </div>
      
      {loading ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div className="stats-container">
          <h3>Game Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.games_played}</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.games_won}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.games_lost}</span>
              <span className="stat-label">Losses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.games_tied}</span>
              <span className="stat-label">Ties</span>
            </div>
          </div>
        </div>
      ) : (
        <p>No stats available yet. Play some games!</p>
      )}
      
      <button 
        onClick={() => void handleLogout()}
        className="logout-button"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile; 