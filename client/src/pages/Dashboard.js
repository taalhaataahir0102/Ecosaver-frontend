import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the API using the userID and token
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://ecosaver-backend-lj4ynzzm3-taalhaataahir0102.vercel.app/api/dashboard/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          // Handle error response
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div>
          <p>User ID: {userID}</p>
          <p>Name: {userData?.name}</p>
          <p>Email: {userData?.email}</p>
          {/* Display other user data */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
