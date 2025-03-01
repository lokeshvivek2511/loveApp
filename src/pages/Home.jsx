import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [daysCount, setDaysCount] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Set your anniversary date here
  const anniversaryDate = new Date('2024-05-29'); // Change this to your actual date
  
  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const timeDiff = today.getTime() - anniversaryDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      setDaysCount(daysDiff);
    };
    
    calculateDays();
    setIsLoading(false);
    
    // Load message from localStorage
    const savedMessage = localStorage.getItem('loveMessage') || '';
    setMessage(savedMessage);
  }, []);
  
  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    localStorage.setItem('loveMessage', newMessage);
  };
  
  if (isLoading) {
    return <div className="loading">Loading our love story...</div>;
  }
  
  return (
    <div className="home-page">
      <div className="hero">
        <div className="heart-animation">❤️</div>
        <h1>Welcome to Our Love Story</h1>
        <p className="subtitle">Every moment with you is a treasure</p>
      </div>
      
      <div className="love-counter">
        <div className="counter-card">
          <h2>{daysCount}</h2>
          <p>Days of Love</p>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Our Special Dates</h3>
          <p>Mark and remember all our special moments together</p>
          <Link to="/calendar" className="btn">View Calendar</Link>
        </div>
        
        <div className="feature-card">
          <h3>Our Memories</h3>
          <p>A collection of our beautiful moments captured in photos</p>
          <Link to="/gallery" className="btn">View Gallery</Link>
        </div>
        
        <div className="feature-card">
          <h3>Love Notes</h3>
          <p>Sweet messages and quotes to brighten our days</p>
          <Link to="/quotes" className="btn">View Quotes</Link>
        </div>
      </div>
      
      <div className="message-box">
        <h3>Leave a Love Note</h3>
        <textarea 
          value={message} 
          onChange={handleMessageChange}
          placeholder="Write a sweet message for your loved one..."
        ></textarea>
        <p className="note">Your message is saved automatically ❤️</p>
      </div>
      
      <div className="floating-hearts">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="floating-heart" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }}>
            {['❤️', '💖', '💕', '💘', '💓'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;