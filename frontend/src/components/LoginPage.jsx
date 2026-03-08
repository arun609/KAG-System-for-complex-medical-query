import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Activity } from 'lucide-react';
import Logo from './ui/Logo';
import ThemeToggle from './ui/ThemeToggle';

export default function LoginPage() {
    const { login, register, loginAsGuest } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (isRegistering) {
            const res = await register(username, password, role);
            if (res.success) {
                setIsRegistering(false);
                setError('Account created! Please log in.'); // Green success message ideally
            } else {
                setError(res.message);
            }
        } else {
            const res = await login(username, password);
            if (!res.success) {
                setError(res.message);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">

            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Professional Static Background */}
            <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-medical-primary opacity-20 blur-[100px]"></div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden"
            >

                {/* Header Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsRegistering(false)}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${!isRegistering ? 'bg-white dark:bg-slate-900 text-medical-primary border-b-2 border-medical-primary' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsRegistering(true)}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${isRegistering ? 'bg-white dark:bg-slate-900 text-medical-primary border-b-2 border-medical-primary' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <Logo size="md" />
                        <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100 font-serif">
                            {isRegistering ? 'Join the Network' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isRegistering ? 'Create your professional profile' : 'Access the medical intelligence system'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50 flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isRegistering && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-1 overflow-hidden"
                                >
                                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Role</label>
                                    <div className="relative">
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-medical-primary focus:border-transparent outline-none transition-all appearance-none text-slate-700 dark:text-slate-200"
                                        >
                                            <option value="student">Medical Student</option>
                                            <option value="researcher">Researcher</option>
                                            <option value="professional">Healthcare Professional</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-medical-primary to-medical-accent text-white font-bold rounded-xl shadow-lg hover:shadow-medical-primary/30 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isRegistering ? 'Create Account' : 'Access System'} <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 flex flex-col gap-4 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or</span>
                            </div>
                        </div>

                        <button
                            onClick={loginAsGuest}
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-medical-primary transition-colors hover:underline"
                        >
                            Continue as Guest Viewer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
