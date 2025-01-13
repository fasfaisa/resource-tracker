
// src/components/UtilizationDashboard.js
import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function UtilizationDashboard() {
  const [utilizationData, setUtilizationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUtilizationData();
  }, []);

  const fetchUtilizationData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/allocations');
      const data = await response.json();
      
      // Process data for visualization
      const processedData = processUtilizationData(data);
      setUtilizationData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching utilization data:', error);
      setLoading(false);
    }
  };

  const processUtilizationData = (data) => {
    // Transform allocation data into a format suitable for charts
    // This is a simplified example - you might want to group by day/week/month
    return data.map(item => ({
      date: new Date(item.start_date).toLocaleDateString(),
      utilization: 1,
      resource: item.resource_name
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Resource Utilization</h2>
        <div className="w-full overflow-x-auto">
          <LineChart width={800} height={400} data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="utilization" stroke="#8884d8" />
          </LineChart>
        </div>
      </Card>
    </div>
  );
}
export default UtilizationDashboard;