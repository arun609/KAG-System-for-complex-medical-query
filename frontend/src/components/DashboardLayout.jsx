import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import {
    LayoutDashboard,
    Search,
    Users,
    Settings,
    LogOut,
    Bell,
    Menu,
    Activity,
    Brain
} from 'lucide-react';
import Logo from './ui/Logo';

export default function DashboardLayout({ children, activeTab = 'dashboard', onNavigate }) {
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'patients', icon: Users, label: 'Patient Records', disabled: true },
        { id: 'query', icon: Brain, label: 'Reasoning Engine' },
        { id: 'settings', icon: Settings, label: 'Settings', disabled: true },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 hidden md:flex">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <Logo size="md" />
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => !item.disabled && onNavigate(item.id)}
                            disabled={item.disabled}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-medical-primary/10 text-medical-primary font-medium shadow-sm'
                                : item.disabled
                                    ? 'opacity-50 cursor-not-allowed text-slate-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            {item.id === 'query' && <span className="ml-auto text-[10px] bg-medical-accent text-white px-1.5 py-0.5 rounded-full">AI</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-medical-primary to-purple-500 flex items-center justify-center text-white font-bold">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.isGuest ? 'Guest Access' : 'Medical Professional'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 justify-center py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 px-8 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-slate-500">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold capitalize">{activeTab === 'query' ? 'Query Interface' : activeTab}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patients, queries..."
                                className="pl-10 pr-4 py-2 text-sm bg-white text-slate-900 rounded-full focus:ring-2 focus:ring-medical-primary outline-none w-64 placeholder-slate-500"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button className="p-2 text-slate-400 hover:text-medical-primary transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {children}
                </div>

            </main>
        </div>
    );
}
