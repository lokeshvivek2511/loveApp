import React, { useState, useEffect } from 'react';
import { getAllCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/api';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllCalendarEvents();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prev.getMonth() - 1);
      return prevMonth;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(prev.getMonth() + 1);
      return nextMonth;
    });
  };
  
  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    
    const event = events.find(e => new Date(e.date).toISOString().split('T')[0] === dateStr);
    if (event) {
      setEventTitle(event.title);
      setEventDescription(event.description || '');
    } else {
      setEventTitle('');
      setEventDescription('');
    }
  };
  
  const handleSaveEvent = async () => {
    if (!selectedDate || !eventTitle) return;
    
    try {
      const existingEvent = events.find(e => new Date(e.date).toISOString().split('T')[0] === selectedDate);
      
      if (existingEvent) {
        const response = await updateCalendarEvent(existingEvent._id, {
          title: eventTitle,
          description: eventDescription,
          date: selectedDate
        });
        setEvents(prev => prev.map(e => e._id === existingEvent._id ? response.data : e));
      } else {
        const response = await addCalendarEvent({
          title: eventTitle,
          description: eventDescription,
          date: selectedDate
        });
        setEvents(prev => [...prev, response.data]);
      }
      
      setSelectedDate(null);
      setEventTitle('');
      setEventDescription('');
      setError(null);
    } catch (err) {
      setError('Failed to save event. Please try again.');
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!selectedDate) return;
    
    const event = events.find(e => new Date(e.date).toISOString().split('T')[0] === selectedDate);
    if (!event) return;
    
    try {
      await deleteCalendarEvent(event._id);
      setEvents(prev => prev.filter(e => e._id !== event._id));
      setSelectedDate(null);
      setEventTitle('');
      setEventDescription('');
      setError(null);
    } catch (err) {
      setError('Failed to delete event. Please try again.');
    }
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = events.find(e => new Date(e.date).toISOString().split('T')[0] === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${event ? 'special' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {event && (
            <div className="event-indicator">
              <span className="event-title">{event.title}</span>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>❮</button>
          <h2>{monthName} {year}</h2>
          <button onClick={handleNextMonth}>❯</button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }
  
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Our Special Dates</h1>
        <p>Mark all the important moments in our journey together</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendar-content">
        {renderCalendar()}
        
        <div className="event-form">
          {selectedDate ? (
            <>
              <h3>Add Special Date</h3>
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  value={eventTitle} 
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., First Date, Anniversary"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={eventDescription} 
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="What makes this day special?"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button className="btn save-btn" onClick={handleSaveEvent}>Save</button>
                {events.find(e => new Date(e.date).toISOString().split('T')[0] === selectedDate) && (
                  <button className="btn delete-btn" onClick={handleDeleteEvent}>Delete</button>
                )}
                <button className="btn cancel-btn" onClick={() => setSelectedDate(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="event-instructions">
              <h3>How to Use</h3>
              <p>Click on any date to add a special event or memory.</p>
              <p>Special dates will be highlighted with a heart and saved for both of you to see.</p>
              <div className="event-examples">
                <p>💖 First Date</p>
                <p>💖 Anniversary</p>
                <p>💖 Special Trips</p>
                <p>💖 Memorable Moments</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;