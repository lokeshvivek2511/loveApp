import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    date: '',
    description: '',
    imageUrl: ''
  });
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  useEffect(() => {
    // Load memories from localStorage
    const savedMemories = localStorage.getItem('memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  }, []);
  
  const saveMemories = (updatedMemories) => {
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMemory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddMemory = (e) => {
    e.preventDefault();
    
    if (!newMemory.title || !newMemory.imageUrl) {
      alert('Please fill in at least the title and image URL');
      return;
    }
    
    const updatedMemories = [
      ...memories,
      {
        ...newMemory,
        id: Date.now().toString()
      }
    ];
    
    saveMemories(updatedMemories);
    setNewMemory({
      title: '',
      date: '',
      description: '',
      imageUrl: ''
    });
    setShowAddForm(false);
  };
  
  const handleDeleteMemory = (id) => {
    const updatedMemories = memories.filter(memory => memory.id !== id);
    saveMemories(updatedMemories);
    setSelectedMemory(null);
  };
  
  const openMemoryDetails = (memory) => {
    setSelectedMemory(memory);
  };
  
  const closeMemoryDetails = () => {
    setSelectedMemory(null);
  };
  
  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Our Beautiful Memories</h1>
        <p>A collection of our special moments together</p>
      </div>
      
      <div className="gallery-actions">
        <button 
          className="btn add-memory-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Memory'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-memory-form">
          <h3>Add a New Memory</h3>
          <form onSubmit={handleAddMemory}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title"
                value={newMemory.title}
                onChange={handleInputChange}
                placeholder="What's this memory about?"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                name="date"
                value={newMemory.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={newMemory.description}
                onChange={handleInputChange}
                placeholder="Tell the story behind this memory..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input 
                type="url" 
                name="imageUrl"
                value={newMemory.imageUrl}
                onChange={handleInputChange}
                placeholder="Paste the URL of your image"
                required
              />
            </div>
            
            <div className="form-note">
              <p>💡 Tip: Upload your image to a free image hosting service like Imgur, then paste the direct link here.</p>
            </div>
            
            <button type="submit" className="btn submit-btn">Save Memory</button>
          </form>
        </div>
      )}
      
      {memories.length === 0 && !showAddForm ? (
        <div className="empty-gallery">
          <div className="empty-icon">📷</div>
          <h3>No Memories Yet</h3>
          <p>Start adding your special moments together</p>
          <button 
            className="btn add-memory-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add First Memory
          </button>
        </div>
      ) : (
        <div className="memories-grid">
          {memories.map(memory => (
            <div 
              key={memory.id} 
              className="memory-card"
              onClick={() => openMemoryDetails(memory)}
            >
              <div className="memory-image">
                <img src={memory.imageUrl} alt={memory.title} />
              </div>
              <div className="memory-info">
                <h3>{memory.title}</h3>
                {memory.date && <p className="memory-date">{new Date(memory.date).toLocaleDateString()}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedMemory && (
        <div className="memory-modal">
          <div className="memory-modal-content">
            <button className="close-btn" onClick={closeMemoryDetails}>×</button>
            
            <div className="memory-modal-image">
              <img src={selectedMemory.imageUrl} alt={selectedMemory.title} />
            </div>
            
            <div className="memory-modal-info">
              <h2>{selectedMemory.title}</h2>
              {selectedMemory.date && (
                <p className="memory-date">
                  {new Date(selectedMemory.date).toLocaleDateString()}
                </p>
              )}
              
              {selectedMemory.description && (
                <p className="memory-description">{selectedMemory.description}</p>
              )}
              
              <button 
                className="btn delete-btn"
                onClick={() => handleDeleteMemory(selectedMemory.id)}
              >
                Delete Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;