// src/components/ResourceList.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      const data = await response.json();
      setResources(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-blue text-center mb-8">Available Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="glass-container card-hover">
            <CardHeader>
              <CardTitle className="text-blue">{resource.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{resource.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  resource.status === 'Available' ? 'bg-green-400/70 text-blue' :
                  resource.status === 'In Use' ? 'bg-blue-400/70 text-blue' :
                  'bg-red-400/70 text-blue'
                }`}>
                  {resource.status}
                </span>
                <span className="text-blue text-sm">{resource.category}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ResourceList;