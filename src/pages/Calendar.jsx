import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [specialDates, setSpecialDates] = useState({});
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  
  useEffect(() => {
    // Load special dates from localStorage
    const savedDates = localStorage.getItem('specialDates');
    if (savedDates) {
      setSpecialDates(JSON.parse(savedDates));
    }
  }, []);
  
  const saveSpecialDates = (dates) => {
    setSpecialDates(dates);
    localStorage.setItem('specialDates', JSON.stringify(dates));
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
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    setSelectedDate(dateStr);
    
    // Pre-fill form if this date has an event
    if (specialDates[dateStr]) {
      setEventTitle(specialDates[dateStr].title);
      setEventDescription(specialDates[dateStr].description);
    } else {
      setEventTitle('');
      setEventDescription('');
    }
  };
  
  const handleSaveEvent = () => {
    if (!selectedDate || !eventTitle) return;
    
    const updatedDates = {
      ...specialDates,
      [selectedDate]: {
        title: eventTitle,
        description: eventDescription
      }
    };
    
    saveSpecialDates(updatedDates);
    setSelectedDate(null);
    setEventTitle('');
    setEventDescription('');
  };
  
  const handleDeleteEvent = () => {
    if (!selectedDate || !specialDates[selectedDate]) return;
    
    const updatedDates = { ...specialDates };
    delete updatedDates[selectedDate];
    
    saveSpecialDates(updatedDates);
    setSelectedDate(null);
    setEventTitle('');
    setEventDescription('');
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month + 1}-${day}`;
      const isSpecial = specialDates[dateStr] ? true : false;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isSpecial ? 'special' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {isSpecial && (
            <div className="event-indicator">
              <span className="event-title">{specialDates[dateStr].title}</span>
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
  
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Our Special Dates</h1>
        <p>Mark all the important moments in our journey together</p>
      </div>
      
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
                {specialDates[selectedDate] && (
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