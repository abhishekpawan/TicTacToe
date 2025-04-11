import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import '../../styles/App.css';

const Layout: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <Outlet />
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Tic Tac Toe Online</p>
      </footer>
    </div>
  );
};

export default Layout; 