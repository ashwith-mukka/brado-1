import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    salesData: []
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
    { title: 'Total Sales', value: `₹${stats.totalSales?.toLocaleString() || 0}`, color: 'bg-green-100 text-green-800' },
    { title: 'Total Orders', value: stats.totalOrders || 0, color: 'bg-blue-100 text-blue-800' },
    { title: 'Total Products', value: stats.totalProducts || 0, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Total Users', value: stats.totalUsers || 0, color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="animate-fadeIn pb-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
          Real-time Analytics
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{stat.title}</h3>
            <p className={`text-2xl font-black rounded-2xl inline-block px-4 py-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sales Graph */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900">Revenue Analytics (Last 7 Days)</h2>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Revenue</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}}
                dy={10}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString('en-IN', { weekday: 'short' });
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontWeight: 'bold', color: '#16a34a' }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#16a34a" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">Recent Activity</h2>
        <div className="text-gray-400 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <p className="text-sm font-bold uppercase tracking-widest mb-2">Live Feed Disabled</p>
          <p className="text-xs">Advanced order monitoring will be available in the next update.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
