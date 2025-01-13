// src/App.js
import React from 'react';
import './index.css';  // or './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResourceList from './components/ResourceList';
import ResourceAllocation from './components/ResourceAllocation';
import UtilizationDashboard from './components/UtilizationDashboard';
import { ResourceProvider } from './context/ResourceContext';
import Home from './pages/Home';

function App() {
  return (
    <ResourceProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-8 animate-fade-in">
            <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/resource" element={<ResourceList />} />
              <Route path="/allocate" element={<ResourceAllocation />} />
              <Route path="/utilization" element={<UtilizationDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ResourceProvider>
  );
}

export default App;