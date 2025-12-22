import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    Users, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    Search,
    Bell,
    ChevronRight,
    Sun,
    Moon,
    PieChart,
    Grid
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link to={path}>
        <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group
            ${active 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
        >
            <Icon size={20} className={active ? 'text-white' : ''} />
            {!collapsed && (
                <span className="font-medium whitespace-nowrap">{label}</span>
            )}
            
            {/* Tooltip for collapsed mode */}
            {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                    {label}
                </div>
            )}
            
            {!collapsed && active && (
                 <motion.div layoutId="active-pill" className="absolute right-2" >
                    <ChevronRight size={16} />
                 </motion.div>
            )}
        </motion.div>
    </Link>
);

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
        { icon: Grid, label: 'Categories', path: '/admin/categories' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: PieChart, label: 'Analytics', path: '/admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex overflow-hidden font-sans">
            
            {/* Sidebar Desktop */}
            <motion.aside 
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                className={`hidden md:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 ease-in-out`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <motion.h1 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                        >
                            Admin<span className="text-gray-800 dark:text-white">Panel</span>
                        </motion.h1>
                    )}
                    <button 
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
                    >
                        {collapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <SidebarItem 
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                     <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50`}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
             <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-800 z-50 shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </h1>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                {navItems.map((item) => (
                                    <SidebarItem 
                                        key={item.path}
                                        {...item}
                                        active={location.pathname === item.path}
                                        collapsed={false}
                                    />
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="sticky top-0 z-20 px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center gap-3 text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                             <Search size={18} />
                             <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent border-none outline-none text-sm w-64 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                             />
                             <div className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-[10px] font-mono">⌘K</div>
                        </div>
                     </div>


                     <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                             <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/30">
                                 <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                     {user?.name?.[0]?.toUpperCase() || 'A'}
                                 </div>
                             </div>
                        </div>
                     </div>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
