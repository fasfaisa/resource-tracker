import React from 'react';
import './Home.css'; // Import the CSS file
import Footer from '../components/Footer.jsx';


function Home() {
  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        <h1 className="hometitle">Welcome to Resource Tracker</h1>
        <p className="homedescription">
          Manage and monitor your resources efficiently. Get insights, track usage, and optimize performance seamlessly.
        </p>
        <button className="cta-button">Explore Now</button>
      </div>
      
    </div>
  );
}

export default Home;
