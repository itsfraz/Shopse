import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
    TrendingUp, 
    Users, 
    ShoppingBag, 
    DollarSign, 
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    AlertCircle
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
    Legend
} from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10`}>
            <Icon size={100} className={color} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')} dark:bg-opacity-20`}>
                    <Icon size={24} className={color} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    // Mock Data
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0, 
        users: 0, 
        products: 0,
        recentOrders: [],
        lowStockProducts: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Revenue Data still mocked for chart visualization until we have real historical data logic
    const revenueData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 2000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                // Ensure defaulting to safe values
                setStats({
                    revenue: data.totalRevenue || 0,
                    orders: data.ordersCount || 0,
                    users: data.usersCount || 0,
                    products: data.productsCount || 0,
                    recentOrders: data.recentOrders || [],
                    lowStockProducts: data.lowStockProducts || []
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="flex items-center justify-center h-96 text-red-500">
                {error}
            </div>
        );
    }



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                     <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Download Report
                     </button>
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        + Add Product
                     </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Revenue" 
                    value={`₹${stats.revenue.toLocaleString()}`} 
                    change="+12.5%" 
                    icon={DollarSign} 
                    color="text-green-600" 
                    trend="up"
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.orders} 
                    change="+8.2%" 
                    icon={ShoppingBag} 
                    color="text-blue-600" 
                    trend="up"
                />
                <StatCard 
                    title="Active Users" 
                    value={stats.users} 
                    change="+5.1%" 
                    icon={Users} 
                    color="text-purple-600" 
                    trend="up"
                />
                <StatCard 
                    title="Products Count" 
                    value={stats.products} 
                    change="+2.4%" 
                    icon={Package} 
                    color="text-orange-600" 
                    trend="down"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Revenue Analytics</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Orders by Source</h3>
                    <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Orders</h3>
                    <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order._id.substring(0,6)}...</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.user?.name || 'Guest'}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{order.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'Pending')}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/admin/orders/${order._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            
            {/* Low-stock Alerts (Brief) */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/20 rounded-xl p-4 flex items-start gap-3"
            >
                <AlertCircle className="text-orange-600 dark:text-orange-500 mt-0.5" size={20} />
                <div>
                     <h4 className="font-bold text-orange-800 dark:text-orange-400">Low Stock Alert</h4>
                     <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                         5 products are running low on stock. <Link to="/admin/products" className="underline font-semibold">Check Inventory</Link>
                     </p>
                </div>
            </motion.div>

        </div>
    );
};

// Quick fix for Link import
import { Link } from 'react-router-dom';

export default AdminDashboard;
