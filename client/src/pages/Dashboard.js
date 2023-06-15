import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the API using the userID and token
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/dashboard/${userID}`, {
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
      }
    };

    fetchUserData();
  }, [userID]);

  return (
    <div>
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <p>User ID: {userID}</p>
          <p>Name: {userData.name}</p>
          <p>E-mail: {userData.email}</p>
          {/* Display other user data */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
