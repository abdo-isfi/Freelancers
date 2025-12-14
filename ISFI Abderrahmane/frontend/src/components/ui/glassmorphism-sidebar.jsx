import React, { useState } from 'react';
import { LayoutDashboard, BarChart2, Users, Folder, CheckSquare, Menu } from 'lucide-react';

// --- Data for each page ---
const pageContent = {
    Dashboard: {
        title: 'Dashboard',
        description: "Welcome back, Serafim. Here's what's happening today.",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Active Projects</h2>
                    <p className="text-4xl font-bold mt-2 text-indigo-400">12</p>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Tasks Due</h2>
                    <p className="text-4xl font-bold mt-2 text-pink-400">5</p>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">New Users</h2>
                    <p className="text-4xl font-bold mt-2 text-emerald-400">28</p>
                </div>
            </div>
        )
    },
    Analytics: {
        title: 'Analytics',
        description: 'Detailed insights and metrics for your projects.',
        content: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card lg:col-span-2 h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart placeholder for User Growth</p>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Bounce Rate</h2>
                    <p className="text-4xl font-bold mt-2 text-indigo-400">24.5%</p>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Session Duration</h2>
                    <p className="text-4xl font-bold mt-2 text-pink-400">8m 12s</p>
                </div>
            </div>
        )
    },
    Users: {
        title: 'Users',
        description: 'Manage all the users in your organization.',
        content: (
            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-gray-400">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        <tr><td className="p-3">Jane Doe</td><td className="p-3">jane.doe@example.com</td><td className="p-3">Admin</td></tr>
                        <tr><td className="p-3">John Smith</td><td className="p-3">john.smith@example.com</td><td className="p-3">Developer</td></tr>
                        <tr><td className="p-3">Sam Wilson</td><td className="p-3">sam.wilson@example.com</td><td className="p-3">Designer</td></tr>
                    </tbody>
                </table>
            </div>
        )
    },
    Projects: {
        title: 'Projects',
        description: 'An overview of all your ongoing and completed projects.',
        content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Project Alpha</h2>
                    <p className="text-sm text-gray-400 mt-1">Status: In Progress</p>
                </div>
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Project Beta</h2>
                    <p className="text-sm text-gray-400 mt-1">Status: Completed</p>
                </div>
            </div>
        )
    },
    Tasks: {
        title: 'Tasks',
        description: 'Track and manage all your tasks and to-dos.',
        content: (
            <div className="card">
                <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span>Finalize Q3 report</span>
                        <span className="text-xs text-pink-400 bg-pink-400/10 px-2 py-1 rounded">Due Tomorrow</span>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span>Design new landing page mockups</span>
                        <span className="text-xs text-gray-400 bg-gray-400/10 px-2 py-1 rounded">In Progress</span>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span>Deploy server updates</span>
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Completed</span>
                    </li>
                </ul>
            </div>
        )
    }
};

const navItems = [
    { page: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { page: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { page: 'Users', icon: <Users className="w-5 h-5" /> },
    { page: 'Projects', icon: <Folder className="w-5 h-5" /> },
    { page: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
];

// Sidebar Component
const Sidebar = ({ activePage, setActivePage }) => (
    <aside className="w-64 flex-shrink-0 flex flex-col z-10 bg-white/5 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0">
        <div className="h-20 flex items-center justify-center border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Menu className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">AetherUI</span>
            </div>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {navItems.map(item => (
                <button
                    key={item.page}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activePage === item.page 
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10 border border-indigo-500/20' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                    onClick={() => setActivePage(item.page)}
                >
                    {item.icon}
                    <span>{item.page}</span>
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-indigo-500/30" 
                />
                <div>
                    <p className="font-semibold text-white text-sm">Serafim P.</p>
                    <p className="text-xs text-gray-400">Admin</p>
                </div>
            </div>
        </div>
    </aside>
);

// Main Content Component
const MainContent = ({ activePage }) => {
    const { title, description, content } = pageContent[activePage];
    return (
        <main className="flex-grow p-8 overflow-y-auto h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                <p className="text-gray-400 mt-2 text-lg">{description}</p>
            </header>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {content}
            </div>
        </main>
    );
};

// Main Dashboard Layout Component
export const GlassmorphismSidebar = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    return (
        <div className="relative min-h-screen w-full flex bg-[#0f172a] text-gray-200 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Background Shapes */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px]"></div>
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
            </div>

            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <MainContent activePage={activePage} />
        </div>
    );
};

export default GlassmorphismSidebar;
