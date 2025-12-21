import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { projects } = useProjects();

    const isAdmin = user?.role === 'admin';
    const myProjects = isAdmin ? projects : projects.filter(p => p.assignedTo === user?.id);

    const totalProjects = myProjects.length;
    const completedProjects = myProjects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = myProjects.filter(p => p.status === 'In Progress').length;

    // For Admin only stats (mocked user count)
    const totalUsers = 2; // In a real app we'd fetch this from user context/api

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-gray-500 mb-8">Here's what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={isAdmin ? "Total Projects" : "My Projects"}
                    value={totalProjects}
                    icon={Briefcase}
                    color="bg-blue-500"
                />
                <StatCard
                    title="In Progress"
                    value={inProgressProjects}
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Completed"
                    value={completedProjects}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                {isAdmin && (
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={Users}
                        color="bg-purple-500"
                    />
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">Project Name</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {myProjects.length === 0 ? (
                                <tr><td colSpan="3" className="py-4 text-center text-gray-500">No projects found</td></tr>
                            ) : (
                                myProjects.slice(0, 5).map(project => (
                                    <tr key={project.id} className="group hover:bg-gray-50">
                                        <td className="py-4 text-gray-800 font-medium">{project.title}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">{project.dueDate || 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
