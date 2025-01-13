import React from 'react';
import './Home.css'; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="content">
        <h1 className="hometitle">Welcome to Resource Tracker</h1>
        <p className="homedescription">
          Manage and monitor your resources efficiently. Get insights, track usage, and optimize performance seamlessly.
        </p>
        <button className="cta-button">Explore Now</button>

        {/* Additional Features */}
        {/* <div className="feature-list-container">
          <FeatureList />
        </div> */}
      </div>
    </div>
  );
}

export default Home;
