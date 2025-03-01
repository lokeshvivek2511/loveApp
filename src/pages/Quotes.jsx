import React, { useState, useEffect } from 'react';
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
  
  // Default quotes
  const defaultQuotes = [
    {
      id: '1',
      text: "I fell in love with you because you loved me when I couldn't love myself.",
      author: "Anonymous",
      color: "#ff6b6b",
      favorite: true
    },
    {
      id: '2',
      text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      author: "Maya Angelou",
      color: "#f06292",
      favorite: false
    },
    {
      id: '3',
      text: "I love you not only for what you are, but for what I am when I am with you.",
      author: "Roy Croft",
      color: "#bb86fc",
      favorite: true
    }
  ];
  
  useEffect(() => {
    // Load quotes from localStorage or use defaults
    const savedQuotes = localStorage.getItem('loveQuotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    } else {
      setQuotes(defaultQuotes);
      localStorage.setItem('loveQuotes', JSON.stringify(defaultQuotes));
    }
  }, []);
  
  const saveQuotes = (updatedQuotes) => {
    setQuotes(updatedQuotes);
    localStorage.setItem('loveQuotes', JSON.stringify(updatedQuotes));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddQuote = (e) => {
    e.preventDefault();
    
    if (!newQuote.text) {
      alert('Please enter a quote');
      return;
    }
    
    const updatedQuotes = [
      ...quotes,
      {
        ...newQuote,
        id: Date.now().toString(),
        favorite: false
      }
    ];
    
    saveQuotes(updatedQuotes);
    setNewQuote({
      text: '',
      author: '',
      color: '#ff6b6b'
    });
    setShowAddForm(false);
  };
  
  const toggleFavorite = (id) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === id ? { ...quote, favorite: !quote.favorite } : quote
    );
    saveQuotes(updatedQuotes);
  };
  
  const deleteQuote = (id) => {
    const updatedQuotes = quotes.filter(quote => quote.id !== id);
    saveQuotes(updatedQuotes);
  };
  
  const filteredQuotes = filter === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.favorite);
  
  return (
    <div className="quotes-page">
      <div className="page-header">
        <h1>Love Notes & Quotes</h1>
        <p>Sweet words to brighten our days</p>
      </div>
      
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
                key={quote.id} 
                className="quote-card"
                style={{ backgroundColor: quote.color }}
              >
                <div className="quote-actions">
                  <button 
                    className="favorite-btn"
                    onClick={() => toggleFavorite(quote.id)}
                  >
                    {quote.favorite ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteQuote(quote.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="quote-content">
                  <p className="quote-text">"{quote.text}"</p>
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