import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import userService from '../services/userService';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { projects, updateProject } = useProjects();

    const project = projects.find(p => p.id === id);
    const [status, setStatus] = useState(project?.status);
    const [assignedUser, setAssignedUser] = useState(null);

    // If project is not found immediately (e.g. reload), it might be loading. 
    // But context loads initial data. If still undefined, display loading or not found.

    useEffect(() => {
        if (project) {
            setStatus(project.status);
            if (project.assignedTo) {
                // In a real app we might have an endpoint to get single user or just filter from all
                // For now, let's fetch all (since we don't have getById exposed in service for plain users, only admins maybe?)
                // Actually userService has default getAllUsers.
                // Optimization: The API might return populated "assignedTo" object directly? 
                // Swagger said "assignedUsers (comma-separated IDs)".
                // Let's assume we need to fetch user details.
                userService.getAllUsers().then(users => {
                    const u = users.find(u => u.id === project.assignedTo);
                    setAssignedUser(u);
                }).catch(err => console.error(err));
            }
        }
    }, [project]);

    if (!project) return <div>Project not found</div>;

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        await updateProject(id, { status: newStatus });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Project Details</h1>
                <button
                    onClick={() => navigate('/projects')}
                    className="text-gray-500 hover:text-gray-700"
                >
                    Back to List
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
                            <p className="text-gray-500">Due Date: {project.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-600">Status:</span>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className={`px-3 py-1 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-blue-500 cursor-pointer
                            ${status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{project.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Assigned To</h3>
                            {assignedUser ? (
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                        {assignedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{assignedUser.name}</p>
                                        <p className="text-xs text-gray-500">{assignedUser.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Unassigned</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
