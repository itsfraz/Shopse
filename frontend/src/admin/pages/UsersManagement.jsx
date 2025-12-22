import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/shared/Toast';
import { 
    Search, 
    MoreHorizontal, 
    User, 
    Shield, 
    Ban, 
    CheckCircle,
    ShoppingBag,
    Eye,
    XCircle,
    TrendingUp,
    History,
    Loader
} from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    // We could fetch real history here, but for now we'll show empty or basic
    // For a real app, you'd fetch /api/orders?user=ID
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <XCircle size={24} />
                    </button>
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl">
                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400">
                                {user.name[0]}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-8 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                {user.name}
                                <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {user.role}
                                </span>
                            </h2>
                            <p className="text-gray-500">{user.email} • ID: {user._id}</p>
                        </div>
                        <div className="flex gap-2">
                             <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                                Reset Password
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stats */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700 col-span-1">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} /> User Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="font-semibold dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-semibold ${user.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                        {user.isActive ? 'Active' : 'Banned'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders - Placeholder for now as we don't fetch per-user orders yet */}
                        <div className="md:col-span-2">
                             <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <ShoppingBag size={20} /> Order History
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 text-center text-gray-500">
                                Order history integration coming soon.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const { addToast } = useToast();

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users", error);
            addToast("Failed to fetch users", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (user) => {
        try {
            const newStatus = !user.isActive;
            const { data } = await api.put(`/admin/users/${user._id}`, { isActive: newStatus });
            setUsers(users.map(u => u._id === user._id ? data : u));
            addToast(`User ${newStatus ? 'activated' : 'banned'} successfully`, 'success');
        } catch (error) {
            console.error("Status update error", error);
            addToast("Failed to update status", 'error');
        }
    };

    const toggleRole = async (user) => {
        try {
            const newRole = user.role === 'admin' ? 'user' : 'admin';
            const { data } = await api.put(`/admin/users/${user._id}`, { role: newRole });
            setUsers(users.map(u => u._id === user._id ? data : u));
            addToast(`User role updated to ${newRole}`, 'success');
        } catch (error) {
            console.error("Role update error", error);
            addToast("Failed to update role", 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    User Management
                </h2>
                <div className="flex gap-3">
                    <div className="relative group">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                         <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm dark:text-white"
                         />
                    </div>
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-0.5">
                                                 <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                     {user.name ? user.name[0].toUpperCase() : 'U'}
                                                 </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => toggleRole(user)}
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors"
                                            title="Click to toggle role"
                                        >
                                            {user.role === 'admin' ? <Shield size={16} className="text-purple-500" /> : <User size={16} />}
                                            <span className="text-sm capitalize">{user.role}</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => toggleStatus(user)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all
                                            ${user.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {user.isActive ? <CheckCircle size={12} /> : <Ban size={12} />}
                                            {user.isActive ? 'Active' : 'Banned'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                     {users.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">
                            No users found.
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <UserDetailsModal 
                        isOpen={!!selectedUser}
                        onClose={() => setSelectedUser(null)}
                        user={selectedUser}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersManagement;
