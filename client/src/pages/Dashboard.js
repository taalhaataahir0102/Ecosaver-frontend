import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css';
import Header from './Header';

const Dashboard = () => {
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch user data from the API using the userID and token
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/dashboard/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setUserData(data.user);
        } else {
          // Handle error response
          window.location.href = '/signin';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleImageChange = (event) => {
    const token = localStorage.getItem('token');
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = async () => {
      const imageData = reader.result;
      console.log(imageData);
      setImage(imageData);
  
      try {
        const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID, image: imageData }),
        });
  
        if (response.ok) {
          console.log('Image upload successful!');
          // Update the user data with the new image
          setUserData((prevUserData) => ({
            ...prevUserData,
            image: imageData,
          }));
        } else {
          const data = await response.json();
          const message = data.message;
          console.log(message);
          // Handle error response
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  
    reader.onerror = (error) => {
      console.log('Error:', error);
    };
  
    // Start reading the file
    reader.readAsDataURL(file);
  };
  

  const calculateRingColor = (score) => {
    const percentage = Math.min(score, 100);
    console.log(percentage,score)
    const color = percentage >= 80 ? 'yellow' : 'red';
    return color;
  };

  return (
    <div>
      <Header />
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="user-info-container">
            <div className="image-container">
              <label htmlFor="image-upload" className="image-box">
                {/* Add an image tag to display the selected image */}
                {userData?.image && (
                    <img width={120} height={120} src={userData?.image} alt="User" />
                  )}
                {/* {image==="" || image === null ?"":<img width={120} height={120} src={image}/>} */}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }} // Hide the input element
              />
            </div>
            <div className="user-info">
              <div className="name-email-container">
                <p className="name">{userData?.name}</p>
                <p className="email">{userData?.email}</p>
              </div>
              <div className="level-score-container">
                <div className="score-ring">
                  <CircularProgressbar
                    value={userData?.score}
                    text={`Level ${userData?.level}`}
                    styles={{
                      path: {
                        stroke: calculateRingColor(userData?.score),
                        transformOrigin: 'center center',
                      },
                      text: {
                        fill: '#000',
                        fontSize: '20px',
                        dominantBaseline: 'middle',
                        textAnchor: 'middle',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
