// src/context/ResourceContext.js
import React, { createContext, useState, useContext } from 'react';

const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      const data = await response.json();
      setResources(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource) => {
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      });
      const data = await response.json();
      setResources([...resources, data]);
      return data;
    } catch (err) {
      setError('Failed to add resource');
      throw err;
    }
  };

  const updateResource = async (id, resource) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      });
      const data = await response.json();
      setResources(resources.map(r => r.id === id ? data : r));
      return data;
    } catch (err) {
      setError('Failed to update resource');
      throw err;
    }
  };

  const value = {
    resources,
    loading,
    error,
    fetchResources,
    addResource,
    updateResource,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
}