import React, { useEffect, useState } from 'react';
import './Support.css';
import Header from './Header';
import help from './images/help.png'

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/signin';
      } else {
        try {
          const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            window.location.href = '/signin';
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    authenticateUser();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform submission logic here, e.g., sending data to backend API
    console.log('Form submitted:', { name, email, subject, message });
    // Clear form fields after submission
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (!isAuthenticated) {
    return null; // Render nothing if user is not authenticated
  }

  return (
    <div className="support-container">
      <Header />
      <div className="support-content">
        <h2>Get Help</h2>
        <form className="support-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <img src={help} alt="Support" className="support-image" /> {/* Add the image with the appropriate class */}
    </div>
    
  );
};

export default Support;
