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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResourcesAndProjects();
  }, []);

  const fetchResourcesAndProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Add logging to debug the fetch requests
      console.log('Fetching resources from:', 'http://localhost:5000/api/resources');
      console.log('Fetching projects from:', 'http://localhost:5000/api/projects');

      const resourcesRes = await fetch('http://localhost:5000/api/resources');
      const projectsRes = await fetch('http://localhost:5000/api/projects');

      if (!resourcesRes.ok) {
        throw new Error(`Resources fetch failed: ${resourcesRes.status}`);
      }
      if (!projectsRes.ok) {
        throw new Error(`Projects fetch failed: ${projectsRes.status}`);
      }

      const resourcesData = await resourcesRes.json();
      const projectsData = await projectsRes.json();

      // Add logging to see the fetched data
      console.log('Fetched resources:', resourcesData);
      console.log('Fetched projects:', projectsData);

      setResources(resourcesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Log the data being sent
        console.log('Submitting allocation data:', formData);

        const response = await fetch('http://localhost:5000/api/allocations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resource_id: parseInt(formData.resource_id),
                project_id: parseInt(formData.project_id),
                start_date: formData.start_date,
                end_date: formData.end_date
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Allocation failed: ${errorData.error || response.status}`);
        }

        const result = await response.json();
        console.log('Allocation successful:', result);
        
        // Clear form after successful submission
        setFormData({
            resource_id: '',
            project_id: '',
            start_date: '',
            end_date: ''
        });
        
        // Optionally show success message
        alert('Resource allocated successfully!');
        
    } catch (error) {
        console.error('Error submitting allocation:', error);
        setError(error.message);
        
        // Show error to user
        alert(`Failed to allocate resource: ${error.message}`);
    }
};
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-blue text-center mt-10 mb-8">Resource Allocation</h1>
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
                className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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