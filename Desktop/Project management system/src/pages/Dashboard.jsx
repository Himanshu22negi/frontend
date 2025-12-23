import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
// import { useProjects } from '../context/ProjectContext'; // Switching to service for consistency
import projectService from '../services/projectService';
import userService from '../services/userService';
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
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await projectService.getAllProjects();
                setProjects(projectData);

                if (user?.role && user.role.toLowerCase() === 'admin') {
                    const userData = await userService.getAllUsers();
                    setUsers(userData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, [user]);

    const isAdmin = user?.role && user.role.toLowerCase() === 'admin';

    // Filter projects for non-admins (or show all for admin if we wanted, but let's see logic)
    // Admin sees all projects count. User sees theirs.
    const myProjects = isAdmin ? projects : projects.filter(p => p.assignedTo === user?.id || (p.assignedUsers && p.assignedUsers.includes(user?.id)));

    const totalProjects = isAdmin ? projects.length : myProjects.length;
    const completedProjects = myProjects.filter(p => p.status === 'completed').length;
    const inProgressProjects = myProjects.filter(p => p.status === 'active' || p.status === 'in-progress').length;
    const totalUsers = users.length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-gray-500 mb-8">Here's what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Admin View: Projects and Users count only */}
                {isAdmin ? (
                    <>
                        <StatCard
                            title="Total Projects"
                            value={totalProjects}
                            icon={Briefcase}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Total Users"
                            value={totalUsers}
                            icon={Users}
                            color="bg-purple-500"
                        />
                    </>
                ) : (
                    /* User View: My Projects, In Progress, Completed */
                    <>
                        <StatCard
                            title="My Projects"
                            value={totalProjects} // reused variable name, context represents count
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
                    </>
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
