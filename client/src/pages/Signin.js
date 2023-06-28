import React, { useState } from 'react';
import './Signin.css';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Create user object
    const user = {
      email,
      password
    };

    // Send user data to the API
    // http://localhost:5000/api/signincheck
    fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/signincheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (response.status === 401) {
          alert('Invalid credentials');
          throw new Error('Invalid credentials');
        }
        if (!response.ok) {
          throw new Error('Error logging in');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Handle the response from the API
        // Redirect to dashboard or desired page
        localStorage.setItem('token', data.token);
        window.location.href = `/dashboard/${data.userID}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSignupClick = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="signin-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Sign In</button>
          <p className="signup-link" onClick={handleSignupClick}>Not registered? Sign up</p>
        </form>
      </div>
    </div>
  );
}

export default Signin;
