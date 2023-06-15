import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !email || !password) {
      alert('Please fill in all fields')
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Create user object
    const user = {
      name,
      email,
      password
    };

    // Send user data to the API
    //  http://localhost:5000/api/createuser
    fetch('https://guttural-spotty-trail.glitch.me/api/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        console.log("here")
        if (response.status === 409) {
          return response.json().then(data => {
            alert(data.message)
            throw new Error(data.message);
          });
        }
        if (!response.ok) {
          throw new Error('Error creating user');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Handle the response from the API
        window.location.href = '/signin'; // Redirect to sign-in page
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSignInClick = () => {
    window.location.href = '/signin';
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Sign Up</button>
          <p className="sign-in-link" onClick={handleSignInClick}>Already registered? Sign in</p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
