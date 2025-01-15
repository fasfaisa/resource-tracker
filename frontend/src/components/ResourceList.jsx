import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Bell, Search, X } from 'lucide-react';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Update resources immediately
      setResources(resources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, status: newStatus }
          : resource
      ));

      // Don't add notification here since we'll get it from SSE
      
    } catch (error) {
      console.error('Error updating resource status:', error);
      // Only add error notifications directly
      setNotifications(prev => [{
        message: `Error: ${error.message}`,
        timestamp: new Date(),
        id: Date.now() // Add unique ID
      }, ...prev]);
    } finally {
      setUpdating(null);
    }
  };

  const checkResourceUpdates = () => {
    const eventSource = new EventSource('http://localhost:5000/api/resources/status-stream');

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Add a unique ID to the notification
      const notificationWithId = {
        ...update,
        id: Date.now()
      };
      
      // Check if this notification is already in the list
      setNotifications(prev => {
        if (!prev.some(notification => 
          notification.message === update.message && 
          Math.abs(new Date(notification.timestamp) - new Date(update.timestamp)) < 1000
        )) {
          return [notificationWithId, ...prev].slice(0, 5);
        }
        return prev;
      });
    };

    eventSource.onerror = (err) => {
      console.error('Error in SSE connection:', err);
      eventSource.close();
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
 const clearNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

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
        <div className="relative" ref={notificationRef}>
          <div className="relative inline-block">
            <Bell 
              className="mt-5 text-blue-500 cursor-pointer hover:text-blue-600"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </div>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications([])}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div 
                      key={index}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 relative"
                    >
                      <button
                        onClick={() => clearNotification(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                      <p className="text-sm text-gray-600 pr-6">{notification.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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