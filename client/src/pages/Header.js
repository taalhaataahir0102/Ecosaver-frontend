import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGlobe, faTrophy, faLightbulb, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { userID } = useParams();


  const handleHome = () => {
      // Redirect to the user's dashboard
      window.location.href = `/dashboard/${userID}`;
    };

  const handleCommunities = () => {
    // Redirect to the user's dashboard
    window.location.href = `/communities/${userID}`;
  };


  const handleLogout = () => {
    // Clear the token and redirect to '/'
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <span className="nav-link" onClick={handleHome}>
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              Home
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={handleCommunities}>
              <FontAwesomeIcon icon={faGlobe} className="nav-icon" />
              Global Communities
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => console.log('Leaderboard clicked')}>
              <FontAwesomeIcon icon={faTrophy} className="nav-icon" />
              Leaderboard
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => console.log('Awareness clicked')}>
              <FontAwesomeIcon icon={faLightbulb} className="nav-icon" />
              Awareness
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => console.log('Help/Support clicked')}>
              <FontAwesomeIcon icon={faQuestionCircle} className="nav-icon" />
              Support
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              Logout
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
