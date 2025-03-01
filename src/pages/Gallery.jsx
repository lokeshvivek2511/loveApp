import React, { useState, useEffect } from 'react';
import { getAllGalleryItems, addGalleryItem, deleteGalleryItem } from '../services/api';
import './Gallery.css';

const Gallery = () => {
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    date: '',
    description: '',
    image: null,
    imagePreview: null
  });
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const response = await getAllGalleryItems();
      setMemories(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load memories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewMemory(prev => ({
            ...prev,
            image: reader.result,
            imagePreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setNewMemory(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddMemory = async (e) => {
    e.preventDefault();
    
    if (!newMemory.title || !newMemory.image) {
      alert('Please fill in at least the title and upload an image');
      return;
    }
    
    try {
      const response = await addGalleryItem({
        title: newMemory.title,
        description: newMemory.description,
        image: newMemory.image,
        date: newMemory.date
      });
      setMemories(prev => [response.data, ...prev]);
      setNewMemory({
        title: '',
        date: '',
        description: '',
        image: null,
        imagePreview: null
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add memory. Please try again.');
    }
  };
  
  const handleDeleteMemory = async (id) => {
    try {
      await deleteGalleryItem(id);
      setMemories(prev => prev.filter(memory => memory._id !== id));
      setSelectedMemory(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete memory. Please try again.');
    }
  };
  
  const openMemoryDetails = (memory) => {
    setSelectedMemory(memory);
  };
  
  const closeMemoryDetails = () => {
    setSelectedMemory(null);
  };
  
  if (loading) {
    return <div className="loading">Loading memories...</div>;
  }

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Our Beautiful Memories</h1>
        <p>A collection of our special moments together</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
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
              <label>Upload Image</label>
              <input 
                type="file" 
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                required
              />
              {newMemory.imagePreview && (
                <div className="image-preview">
                  <img src={newMemory.imagePreview} alt="Preview" />
                </div>
              )}
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
              key={memory._id} 
              className="memory-card"
              onClick={() => openMemoryDetails(memory)}
            >
              <div className="memory-image">
                <img src={memory.image} alt={memory.title} />
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
              <img src={selectedMemory.image} alt={selectedMemory.title} />
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
                onClick={() => handleDeleteMemory(selectedMemory._id)}
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