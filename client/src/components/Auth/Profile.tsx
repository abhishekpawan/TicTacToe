import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { gameAPI } from "../../services/api";
import Button from "../UI/Button";
import "../../styles/Profile.css";

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await gameAPI.getStats();
      if (response && response.data) {
        setStats(response.data as GameStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial stats fetch
  useEffect(() => {
    void fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Manually refresh stats
  const refreshStats = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (!user) return <div className="profile-empty">Please login to view your profile</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
        <Button
          className="refresh-btn"
          variant="outline"
          size="small"
          onClick={() => void refreshStats()}
          disabled={refreshing || loading}
        >
          {refreshing ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </div>

      <div className="profile-card user-info">
        <div className="info-row">
          <span className="info-label">Email</span>
          <span className="info-value">{user.email || "No email"}</span>
        </div>
        {user.user_metadata?.username && (
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value">{user.user_metadata.username}</span>
          </div>
        )}
      </div>

      <div className="profile-card stats-card">
        <h3>Game Statistics</h3>
        
        {loading ? (
          <div className="stats-loading">Loading statistics...</div>
        ) : stats ? (
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.games_played}</span>
              <span className="stat-label">Played</span>
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
        ) : (
          <div className="no-stats">No stats available yet. Play some games!</div>
        )}
      </div>
      
      <Button
        className="logout-btn"
        variant="primary"
        size="large"
        onClick={() => void handleLogout()}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Profile;
