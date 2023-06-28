import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Communities.css';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Communities = () => {
  const { userID } = useParams();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [communities, setCommunities] = useState([]);
  const [communityID, setCommunityID] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCommunityname, setactiveCommunityname] = useState('');


  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/communities/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
        console.log(data);
      } else {
        console.error('Failed to fetch communities');
        window.location.href = '/signin';
      }
    } catch (error) {
      window.location.href = '/signin';
      console.error('Error fetching communities:', error);
    }
  };

  const handleCommunityClick = async (community,community_name) => {
    setActiveCommunity(community);
    console.log(community);
    setLoading(true);
    setactiveCommunityname(community_name);
    // const clickedCommunity = communities.find((c) => c.name === community);
      // setCommunityID(clickedCommunity._id);

      try {
        const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/communitychat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            communityId: community,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch community chat');
        }
      } catch (error) {
        console.error('Error fetching community chat:', error);
      } finally {
        setLoading(false);
      }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() !== '') {
      try {
        // Fetch the user's name from the backend API
        const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/getUserName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userID,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const userName = data.name; // Extract the user's name from the response
          console.log(userName);
          const newMessage = {
            name: userName, // Use the retrieved user's name
            comment: messageInput.trim(),
            user_id: data.user_id
          };

          // Call the /api/chat endpoint to save the message
          const chatResponse = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              community_id: activeCommunity, // Pass the active community ID
              user_id: userID, // Pass the user ID
              message: newMessage.comment,
            }),
          });

          if (chatResponse.ok) {
            // Message saved successfully
            // Handle success case, e.g., show a success message
            console.log('Message saved successfully');

            // Update the messages state with the new message
            setMessages([...messages, newMessage]);

            // Clear the message input
            setMessageInput('');
          } else {
            // Error saving message
            // Handle error case, e.g., show an error message
            const errorData = await chatResponse.json();
            alert(errorData.msg);
          }
        } else {
          // Error fetching user's name
          // Handle error case, e.g., show an error message
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const handleCreateCommunity = () => {
    setShowCreateCommunity(true);
    setActiveCommunity(null); // Reset the active community
  };

  const handleCloseCreateCommunity = () => {
    setShowCreateCommunity(false);
    setCommunityName('');
    setCommunityDescription('');
  };

  const handleCreateCommunitySubmit = () => {
    // Perform validation on community name and description
    if (communityName.trim() !== '' && communityDescription.trim() !== '') {
      // Create the community
      // You can handle community creation logic here, e.g., make an API call
      const createCommunity = async () => {
        try {
          const response = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/createcommunity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: communityName,
              description: communityDescription,
              user_id: userID,
            }),
          });

          if (response.ok) {
            // Community created successfully
            // Handle success case, e.g., show a success message
            const data = await response.json();
            console.log(data.msg);
            window.location.href = `/communities/${userID}`;
          } else {
            // Error creating community
            // Handle error case, e.g., show an error message
            const errorData = await response.json();
            alert(errorData.msg);
          }
        } catch (error) {
          console.error('Error creating community:', error);
        } finally {
          // Reset the form
          setShowCreateCommunity(false);
          setCommunityName('');
          setCommunityDescription('');
        }
      };

      createCommunity();
    }
  };

  const handlePerson = (user_id) => {
    // Handle the logic to display user details or navigate to user profile
    window.location.href = `/viewuser/${user_id}`;
  };

  const handleDeleteCommunity = async (activeCommunity) => {
    try {
      console.log(activeCommunity);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/deletecommunity/${userID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          communityid: activeCommunity,
        }),
      });
  
      if (response.ok) {
        // Community deleted successfully
        alert('Community deleted successfully');
        window.location.href = `/communities/${userID}`;
      } else {
        // Failed to delete community
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting community:', error);
    }
  };

  useEffect(() => {
    // Fetch the communities when the component mounts
    fetchCommunities();
  }, []);

  return (
    <div>
      <Header />
      <div className="community-page">
        <div className="sidebar">
          <h2 className="sidebar-title">Communities</h2>
          <div className="community-list-wrapper">
            <ul className="community-list">
            {communities.map((community) => (
              <li
                className={`community-item ${activeCommunity === community._id ? 'active' : ''}`}
                onClick={() => handleCommunityClick(community._id,community.name)}
                key={community._id}
              >
                {community.name}
              </li>
            ))}
            </ul>
          </div>
          <button className="create-community-button" onClick={handleCreateCommunity}>
            Create Community
          </button>
        </div>

        <div className="main-section">
          {showCreateCommunity ? (
            <div className="create-community-box">
              <h2>Create Community</h2>
              <input
                type="text"
                placeholder="Community Name (Max 15 characters)"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Community Description (Max 60 characters)"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
              />
              <div className="create-community-buttons">
                <button className="cancel-button" onClick={handleCloseCreateCommunity}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleCreateCommunitySubmit}>
                  Create
                </button>
              </div>
            </div>
          ) : activeCommunity ? (
            <>
              <h2 className="main-title">
                {activeCommunityname}
                {communities.find((community) => community._id === activeCommunity)?.owner === userID && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="delete-icon"
                    onClick={() => handleDeleteCommunity(activeCommunity)}
                  />
                )}
              </h2>
              <p className="community-description">
                {communities.find((community) => community._id === activeCommunity)?.description}
              </p>

              {loading ? (
                <div className="loading-spinner" /> // Display the loading spinner
              ) : (
                <div className="chat-messages">
                  {messages.map((message, index) => (
                    <div
                      className={`message ${message.user_id === userID ? 'sent-by-me' : 'sent-by-others'}`}
                      key={index}
                    >
                      <p className="sender-name" onClick={() => handlePerson(message.user_id)}>
                        {message.name}
                      </p>
                      <p>{message.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-community-selected">
              <p>Select a community to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communities;
