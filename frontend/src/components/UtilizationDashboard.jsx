import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

function UtilizationDashboard() {
  const [utilizationData, setUtilizationData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchUtilizationData();
  }, []);

  const fetchUtilizationData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/allocations');
      const data = await response.json();
      
      // Process data for different visualizations
      const { lineData, resourceStats, barData } = processUtilizationData(data);
      setUtilizationData(lineData);
      setResourceData(resourceStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching utilization data:', error);
      setLoading(false);
    }
  };

  const processUtilizationData = (data) => {
    // Process data for line chart - daily utilization
    const lineData = data.reduce((acc, item) => {
      const date = new Date(item.start_date).toLocaleDateString();
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.utilization += 1;
      } else {
        acc.push({ date, utilization: 1 });
      }
      return acc;
    }, []);

    // Process data for pie chart - resource distribution
    const resourceStats = Object.entries(
      data.reduce((acc, item) => {
        acc[item.resource_name] = (acc[item.resource_name] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    // Process data for bar chart - project allocation
    const barData = Object.entries(
      data.reduce((acc, item) => {
        acc[item.project_name] = (acc[item.project_name] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, allocations: value }));

    return { lineData, resourceStats, barData };
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Resource Utilization Dashboard</h1>
      
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={utilizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="utilization" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData.slice(-7)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UtilizationDashboard;