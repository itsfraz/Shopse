import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/shared/Toast';
import { 
    Search, 
    Filter, 
    Eye, 
    Download,
    CheckCircle,
    XCircle,
    Truck,
    User,
    Loader
} from 'lucide-react';

const OrderDetailsModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
    if (!isOpen || !order) return null;

    const handleDeliver = () => {
        onUpdateStatus(order._id, 'deliver');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Details</h2>
                        <p className="text-gray-500 text-sm">Order ID: {order._id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <XCircle size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <User size={18} /> Customer Info
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p><span className="font-semibold">Name:</span> {order.user?.name || 'Guest'}</p>
                            <p><span className="font-semibold">Email:</span> {order.user?.email || order.shippingAddress?.email || 'N/A'}</p>
                            <p><span className="font-semibold">ID:</span> {order.user?._id || 'N/A'}</p>
                        </div>

                        <h3 className="font-bold text-gray-800 dark:text-white mt-6 mb-4 flex items-center gap-2">
                             <Truck size={18} /> Shipping Address
                        </h3>
                         <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p>{order.shippingAddress?.address}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    <div>
                         <h3 className="font-bold text-gray-800 dark:text-white mb-4">Order Summary</h3>
                         <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-4">
                             {order.orderItems && order.orderItems.map((item, idx) => (
                                 <div key={idx} className="flex justify-between items-center text-sm">
                                     <div className="flex items-center gap-3">
                                         {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shadow-sm" />}
                                         <span className="text-gray-800 dark:text-white">{item.name} x {item.qty || item.quantity}</span>
                                     </div>
                                     <span className="font-semibold text-gray-900 dark:text-white">₹{(item.price * (item.qty || item.quantity)).toFixed(2)}</span>
                                 </div>
                             ))}
                             <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{order.itemsPrice || order.totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Tax</span>
                                    <span>₹{order.taxPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2">
                                    <span>Total</span>
                                    <span>₹{order.totalPrice}</span>
                                </div>
                             </div>
                         </div>
                         <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <p className="text-sm font-semibold dark:text-gray-300">Payment Method: <span className="text-blue-600">{order.paymentMethod}</span></p>
                            <p className="text-sm font-semibold dark:text-gray-300">Paid: {order.isPaid ? <span className="text-green-600">Yes ({new Date(order.paidAt).toLocaleDateString()})</span> : <span className="text-red-600">No</span>}</p>
                         </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                     <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Download size={18} />
                        Invoice PDF
                     </button>
                     {!order.isDelivered && (
                         <button 
                            onClick={handleDeliver}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-transform active:scale-95"
                         >
                            <Truck size={18} />
                            Mark as Delivered
                         </button>
                     )}
                     {order.isDelivered && (
                        <span className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-100 text-green-700 font-medium cursor-default">
                             <CheckCircle size={18} />
                             Delivered
                        </span>
                     )}
                </div>
            </motion.div>
        </div>
    );
};

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders", error);
            addToast("Failed to fetch orders", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // Poll for new orders every 10 seconds
        const interval = setInterval(() => {
             // Silent background refresh
             const silentFetch = async () => {
                 try {
                     const { data } = await api.get('/orders');
                     // Simple diff check to avoid unnecessary re-renders
                     setOrders(prev => {    
                         if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
                         return prev;
                     });
                 } catch (err) {
                     console.error("Silent fetch error", err);
                 }
             };
             silentFetch();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id, action) => {
        if (action === 'deliver') {
            try {
                const { data } = await api.put(`/orders/${id}/deliver`);
                setOrders(orders.map(o => o._id === id ? data : o));
                if (selectedOrder && selectedOrder._id === id) {
                    setSelectedOrder(data);
                }
                addToast("Order marked as delivered", 'success');
            } catch (error) {
                console.error("Update error", error);
                addToast("Failed to update order", 'error');
            }
        }
    };

    const getStatusColor = (order) => {
        if (order.isDelivered) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (order.isPaid) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    };

    const getStatusText = (order) => {
        if (order.isDelivered) return 'Delivered';
        if (order.isPaid) return 'Paid / Processing';
        return 'Pending Payment';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Orders
                </h2>
                <div className="flex gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                         <input 
                            type="text" 
                            placeholder="Search orders..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm dark:text-white"
                         />
                    </div>
                    <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-all">
                        <Filter size={20} />
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white">
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                     {loading ? (
                         <div className="flex items-center justify-center h-full py-20">
                            <Loader className="animate-spin text-blue-600" size={32} />
                         </div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.filter(o => o._id.includes(searchQuery) || (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</span>
                                            <span className="text-xs text-gray-400">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{order.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order)}`}>
                                            {getStatusText(order)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                         <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                     {orders.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">
                            No orders found.
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailsModal 
                        isOpen={!!selectedOrder} 
                        onClose={() => setSelectedOrder(null)} 
                        order={selectedOrder} 
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManagement;
