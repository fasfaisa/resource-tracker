// src/App.js
import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResourceList from './components/ResourceList';
import ResourceAllocation from './components/ResourceAllocation';
import UtilizationDashboard from './components/UtilizationDashboard';
import { ResourceProvider } from './context/ResourceContext';
import Home from './pages/Home';
import Footer from './components/Footer'; // Import the Footer component

function App() {
  return (
    <ResourceProvider>
      <Router>
        <div className="flex flex-col min-h-screen">  {/* Add flex and flex-col */}
          <Navbar />
          <main className="container mx-auto px-4 py-8 animate-fade-in flex-grow">  {/* Add flex-grow */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resource" element={<ResourceList />} />
              <Route path="/allocate" element={<ResourceAllocation />} />
              <Route path="/utilization" element={<UtilizationDashboard />} />
            </Routes>
          </main>
          <Footer />  {/* Add Footer component here */}
        </div>
      </Router>
    </ResourceProvider>
  );
}

export default App;