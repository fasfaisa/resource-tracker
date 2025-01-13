import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Bell, Search, Filter } from 'lucide-react';

const RESOURCE_STATUSES = ["Available", "In Use", "Under Maintenance"];

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState(new Set());
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchResources();
    const interval = setInterval(() => {
      checkResourceUpdates();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      const data = await response.json();
      setResources(data);
      setCategories(new Set(data.map(r => r.category)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const updateResourceStatus = async (resourceId, newStatus) => {
    setUpdating(resourceId);
    try {
        console.log('Sending update request:', { resourceId, newStatus }); // Debug log

        const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
      });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update status');
        }

        console.log('Update response:', data); // Debug log

        // Update resources with the confirmed status from server
        setResources(resources.map(resource => 
            resource.id === resourceId 
                ? { ...resource, status: newStatus }
                : resource
        ));

        // Add notification using server message
        setNotifications(prev => [{
            message: data.message || `Resource status updated to ${newStatus}`,
            timestamp: new Date()
        }, ...prev].slice(0, 5));

    } catch (error) {
        console.error('Error updating resource status:', error);
        setNotifications(prev => [{
            message: `Error: ${error.message}`,
            timestamp: new Date()
        }, ...prev].slice(0, 5));
        // Revert the optimistic update by fetching fresh data
        fetchResources();
    } finally {
        setUpdating(null);
    }
};
const checkResourceUpdates = () => {
  const eventSource = new EventSource('http://localhost:5000/api/resources/status-stream');

  eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setNotifications((prev) => [update, ...prev].slice(0, 5));
      fetchResources(); // Optionally refresh resources
  };

  eventSource.onerror = (err) => {
      console.error('Error in SSE connection:', err);
      eventSource.close(); // Close on error
  };

  return () => eventSource.close();
};

useEffect(() => {
  const cleanup = checkResourceUpdates();
  return cleanup;
}, []);


  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || resource.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-400 text-white';
      case 'In Use': return 'bg-blue-400 text-white';
      case 'Under Maintenance': return 'bg-red-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const chartData = RESOURCE_STATUSES.map(status => ({
    name: status,
    count: resources.filter(r => r.status === status).length
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blue-500">Resource Management</h1>
        <div className="relative">
          <Bell className="text-blue-500 cursor-pointer" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Array.from(categories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {RESOURCE_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resource Utilization</h2>
        <div className="w-full h-64 overflow-x-auto">
          <BarChart width={800} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">{resource.name}</h3>
              <p className="text-gray-700 mb-4">{resource.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <select
                    value={resource.status}
                    onChange={(e) => updateResourceStatus(resource.id, e.target.value)}
                    disabled={updating === resource.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)} cursor-pointer`}
                  >
                    {RESOURCE_STATUSES.map(status => (
                      <option 
                        key={status} 
                        value={status}
                        className="bg-white text-gray-700"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  {updating === resource.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                </div>
                <span className="text-blue-500 text-sm">{resource.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;