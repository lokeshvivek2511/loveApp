import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Gallery from './pages/Gallery';
import Quotes from './pages/Quotes';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="app">
      <header>
        <div className="container">
          <div className="header-content">
            <h1 className="logo">Our Love Story ❤️</h1>
            {user && (
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            )}
            <button className="nav-toggle" onClick={toggleNav}>
              ☰
            </button>
          </div>
          <nav className={isNavOpen ? 'open' : ''}>
            <ul>
              <li><Link to="/" onClick={toggleNav}>Home</Link></li>
              <li><Link to="/calendar" onClick={toggleNav}>Our Calendar</Link></li>
              <li><Link to="/gallery" onClick={toggleNav}>Memories</Link></li>
              <li><Link to="/quotes" onClick={toggleNav}>Love Notes</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <div className="container">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/gallery" element={user ? <Gallery /> : <Navigate to="/login" />} />
            <Route path="/quotes" element={user ? <Quotes /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </main>
      
      <footer>
        <div className="container">
          <p>Made with ❤️ just for you</p>
          <div className="hearts">
            <span>❤️</span>
            <span>💖</span>
            <span>💕</span>
            <span>💘</span>
            <span>💓</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;