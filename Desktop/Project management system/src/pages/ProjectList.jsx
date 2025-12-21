import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectList = () => {
    const { user } = useAuth();
    const { projects } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const isAdmin = user?.role === 'admin';

    // Filter logic
    const myProjects = isAdmin ? projects : projects.filter(p => p.assignedTo === user?.id);
    const filteredProjects = myProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                {isAdmin && (
                    <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
                        <Plus size={20} />
                        <span>New Project</span>
                    </Link>
                )}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <Link key={project.id} to={`/projects/${project.id}`} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">{project.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Due: {project.dueDate || 'N/A'}</span>
                                {/* <span>Assigned: {project.assignedTo}</span> */}
                            </div>
                        </div>
                    </Link>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
