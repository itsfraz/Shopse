import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api'; 
import { 
    Download, 
    Calendar,
    Users,
    TrendingUp,
    DollarSign,
    ShoppingBag
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AnalyticsCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon size={24} className={color} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-500 font-bold">{change}</span>
            <span className="text-gray-400">vs last month</span>
        </div>
    </div>
);

const Analytics = () => {
    // Real Data State
    const [stats, setStats] = useState({
        totalRevenue: 0,
        ordersCount: 0,
        usersCount: 0,
        productsCount: 0
    });
    const [loading, setLoading] = useState(true);

    // Mock Data for Charts (until historical API is ready)
    const revenueData = [
        { name: 'Jan', revenue: 4000, profit: 2400 },
        { name: 'Feb', revenue: 3000, profit: 1398 },
        { name: 'Mar', revenue: 2000, profit: 9800 },
        { name: 'Apr', revenue: 2780, profit: 3908 },
        { name: 'May', revenue: 1890, profit: 4800 },
        { name: 'Jun', revenue: 2390, profit: 3800 },
        { name: 'Jul', revenue: 3490, profit: 4300 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Wearables', value: 300 },
        { name: 'Audio', value: 300 },
        { name: 'Accessories', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        const fetchStats = async () => {
             try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data || {});
            } catch (error) {
                console.error("Error fetching analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const avgOrderValue = stats.ordersCount > 0 ? (stats.totalRevenue / stats.ordersCount).toFixed(2) : '0.00';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Analytics & Reports
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Deep dive into your store's performance.</p>
                </div>
                <div className="flex gap-3">
                     <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Calendar size={18} />
                        Last 30 Days
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        <Download size={18} />
                        Export Report
                     </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard 
                    title="Total Revenue" 
                    value={`₹${stats.totalRevenue.toLocaleString()}`} 
                    change="+12.5%" 
                    icon={DollarSign} 
                    color="text-green-600" 
                />
                <AnalyticsCard 
                    title="Total Orders" 
                    value={stats.ordersCount} 
                    change="+8.1%" 
                    icon={ShoppingBag} 
                    color="text-blue-600" 
                />
                <AnalyticsCard 
                    title="Total Users" 
                    value={stats.usersCount} 
                    change="+24.3%" 
                    icon={Users} 
                    color="text-purple-600" 
                />
                <AnalyticsCard 
                    title="Avg. Order Value" 
                    value={`₹${avgOrderValue}`} 
                    change="-2.4%" 
                    icon={TrendingUp} 
                    color="text-orange-600" 
                />
            </div>

            {/* Main Growth Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Revenue vs Profit Trend</h3>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Sales by Category</h3>
                    <div className="h-[300px] flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Monthly User Acquisition</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
