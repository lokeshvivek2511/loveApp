import React, { useState, useEffect } from 'react';
import { getAllQuotes, addQuote, updateQuote, deleteQuote } from '../services/api';
import './Quotes.css';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: '',
    color: '#ff6b6b'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const response = await getAllQuotes();
      setQuotes(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load quotes. Please check your connection and try again.';      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddQuote = async (e) => {
    e.preventDefault();
    
    if (!newQuote.text) {
      setError('Please enter a quote');
      return;
    }
    
    try {
      const quoteData = {
        content: newQuote.text,
        author: newQuote.author,
        color: newQuote.color,
        isFavorite: false
      };
      
      const response = await addQuote(quoteData);
      setQuotes(prev => [response.data, ...prev]);
      setNewQuote({
        text: '',
        author: '',
        color: '#ff6b6b'
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add quote. Please check your connection and try again.';
      setError(errorMessage);
    }
  };
  
  const toggleFavorite = async (id) => {
    try {
      const quote = quotes.find(q => q._id === id);
      const response = await updateQuote(id, { isFavorite: !quote.isFavorite });
      setQuotes(prev => prev.map(q => q._id === id ? response.data : q));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update quote. Please check your connection and try again.';
      setError(errorMessage);
    }
  };
  
  const handleDeleteQuote = async (id) => {
    try {
      await deleteQuote(id);
      setQuotes(prev => prev.filter(quote => quote._id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete quote. Please check your connection and try again.';
      setError(errorMessage);
    }
  };
  
  const filteredQuotes = filter === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.isFavorite);
  
  if (loading) {
    return <div className="loading">Loading quotes...</div>;
  }

  return (
    <div className="quotes-page">
      <div className="page-header">
        <h1>Love Notes & Quotes</h1>
        <p>Sweet words to brighten our days</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="quotes-actions">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Quotes
          </button>
          <button 
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            Favorites ❤️
          </button>
        </div>
        
        <button 
          className="btn add-quote-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Quote'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-quote-form">
          <h3>Add a Love Quote</h3>
          <form onSubmit={handleAddQuote}>
            <div className="form-group">
              <label>Quote</label>
              <textarea 
                name="text"
                value={newQuote.text}
                onChange={handleInputChange}
                placeholder="Enter a beautiful love quote..."
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Author (optional)</label>
              <input 
                type="text" 
                name="author"
                value={newQuote.author}
                onChange={handleInputChange}
                placeholder="Who said this?"
              />
            </div>
            
            <div className="form-group">
              <label>Color</label>
              <div className="color-picker">
                {['#ff6b6b', '#f06292', '#bb86fc', '#4dc9f6', '#f7b731', '#66bb6a'].map(color => (
                  <div 
                    key={color}
                    className={`color-option ${newQuote.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewQuote(prev => ({ ...prev, color }))}
                  ></div>
                ))}
              </div>
            </div>
            
            <button type="submit" className="btn submit-btn">Save Quote</button>
          </form>
        </div>
      )}
      
      <div className="quotes-container">
        {filteredQuotes.length === 0 ? (
          <div className="empty-quotes">
            <div className="empty-icon">💌</div>
            <h3>No Quotes Yet</h3>
            <p>Add some beautiful love quotes to brighten your day</p>
            <button 
              className="btn add-quote-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add First Quote
            </button>
          </div>
        ) : (
          <div className="quotes-grid">
            {filteredQuotes.map(quote => (
              <div 
                key={quote._id} 
                className="quote-card"
                style={{ backgroundColor: quote.color }}
              >
                <div className="quote-actions">
                  <button 
                    className="favorite-btn"
                    onClick={() => toggleFavorite(quote._id)}
                  >
                    {quote.isFavorite ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteQuote(quote._id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="quote-content">
                  <p className="quote-text">"{quote.content}"</p>
                  {quote.author && <p className="quote-author">- {quote.author}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
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

export default Quotes;