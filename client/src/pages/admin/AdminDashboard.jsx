import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/admin/stats');
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Sales', value: `$${stats.totalSales || 0}`, color: 'bg-green-100 text-green-800' },
    { title: 'Total Orders', value: stats.totalOrders || 0, color: 'bg-blue-100 text-blue-800' },
    { title: 'Total Products', value: stats.totalProducts || 0, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Total Users', value: stats.totalUsers || 0, color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{stat.title}</h3>
            <p className={`text-3xl font-bold rounded-lg px-4 py-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-center py-10">
          <p>More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
