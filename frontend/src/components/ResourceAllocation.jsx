// src/components/ResourceAllocation.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

function ResourceAllocation() {
  const [formData, setFormData] = useState({
    resource_id: '',
    project_id: '',
    start_date: '',
    end_date: ''
  });
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchResourcesAndProjects();
  }, []);

  const fetchResourcesAndProjects = async () => {
    try {
      const [resourcesRes, projectsRes] = await Promise.all([
        fetch('http://localhost:5000/api/resources'),
        fetch('http://localhost:5000/api/projects')
      ]);
      const resourcesData = await resourcesRes.json();
      const projectsData = await projectsRes.json();
      setResources(resourcesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... handle submission
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-blue text-center mb-8">Resource Allocation</h1>
      <Card className="glass-container">
        <CardHeader>
          <CardTitle className="text-blue">Allocate Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <select
                value={formData.resource_id}
                onChange={(e) => setFormData({...formData, resource_id: e.target.value})}
                className="w-full p-2 rounded bg-black/20 text-blue border border-black/30 focus:outline-none focus:ring-2 focus:ring-black/50"
              >
                <option value="" className="bg-gray-800">Select Resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id} className="bg-gray-800">
                    {resource.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                className="w-full p-2 rounded bg-black/20 text-blue border border-black/30 focus:outline-none focus:ring-2 focus:ring-black/50"
              >
                <option value="" className="bg-gray-800">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id} className="bg-gray-800">
                    {project.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full p-2 rounded bg-black/20 text-blue border border-black/30 focus:outline-none focus:ring-2 focus:ring-black/50"
              />

              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full p-2 rounded bg-black/20 text-blue border border-black/30 focus:outline-none focus:ring-2 focus:ring-black/50"
              />

              <Button type="submit" className="w-full bg-black hover:bg-black/30 text-white">
                Allocate Resource
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResourceAllocation;