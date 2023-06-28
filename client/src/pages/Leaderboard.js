import React, { useEffect, useState } from 'react';
import './Leaderboard.css';
import Header from './Header';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try { 
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/signin';
          return;
        }  
        const userResponse = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(userResponse);
        if (!userResponse.ok) {
          window.location.href = '/signin';
          return;
        }

        const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/leaderboard');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePerson = (user_id) => {
    // Handle the logic to display user details or navigate to user profile
    window.location.href = `/viewuser/${user_id}`;
  };

  return (
    <div className="leaderboard-page">
      <Header />
      <div className="leaderboard-content">
        <h2>Leaderboard</h2>
        <div className="search-container">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="clickable-name" onClick={() => handlePerson(user._id)}>
                    {user.name}
                  </td>
                  <td>{user.score}</td>
                  <td>{user.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
