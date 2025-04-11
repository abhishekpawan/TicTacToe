import './styles/App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import GamePage from './pages/GamePage';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import { AuthProtectedRoute, PrivateRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <div className="app-wrapper">
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <GameProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    {/* Redirect home to welcome page */}
                    <Route index element={<Navigate to="/welcome" replace />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/game" element={<GamePage />} />
                    
                    {/* Auth routes - protected from authenticated users */}
                    <Route element={<AuthProtectedRoute />}>
                      <Route path="/auth" element={<AuthPage />} />
                    </Route>
                    
                    {/* Add private routes here that require authentication */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </GameProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
