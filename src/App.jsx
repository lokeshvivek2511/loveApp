import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Gallery from './pages/Gallery';
import Quotes from './pages/Quotes';
import './App.css';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="app">
      <header>
        <div className="container">
          <div className="header-content">
            <h1 className="logo">Our Love Story ❤️</h1>
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
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/quotes" element={<Quotes />} />
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