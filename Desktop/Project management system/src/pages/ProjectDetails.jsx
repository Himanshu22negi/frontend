import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useProjects } from '../context/ProjectContext'; // Switching to service direct
import projectService from '../services/projectService';
import userService from '../services/userService';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    // const { projects, updateProject } = useProjects(); // switch to local state for edit
    const [project, setProject] = useState(null);
    const [status, setStatus] = useState('');
    const [assignedUser, setAssignedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        status: '',
        attachments: ''
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const data = await projectService.getProject(id);
            setProject(data);
            setStatus(data.status);
            setFormData({
                title: data.title,
                status: data.status,
                attachments: '' // files reset on edit load usually
            });

            if (data.assignedTo || data.assignedUsers) {
                // Handle single assignment logic as before or simpler
                const userId = data.assignedTo || (Array.isArray(data.assignedUsers) ? data.assignedUsers[0] : data.assignedUsers);
                // Fetch user logic...
                userService.getAllUsers().then(users => {
                    const u = users.find(u => u.id === userId || u._id === userId);
                    setAssignedUser(u);
                }).catch(err => console.error(err));
            }

        } catch (error) {
            console.error("Failed to load project", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('status', formData.status);
        if (file) {
            data.append('attachments', file);
        }

        try {
            await projectService.updateProject(id, data);
            setIsEditing(false);
            loadProject(); // Reload to show updates
            alert("Project updated successfully");
        } catch (error) {
            console.error("Failed to update project", error);
            alert("Failed to update project");
        }
    };

    if (!project) return <div>Loading...</div>;

    // Permissions: Admin can edit? User can edit? Request says "User Role id so that a user will be able to modify"
    // Assuming both or at least the assigned user/any user (as per request "User Role").
    const canEdit = true; // or based on role/ownership if strict

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
                    {!isEditing ? (
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
                                <p className="text-gray-500">Due Date: {project.endDate || project.dueDate}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                    ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        (project.status === 'active' || project.status === 'in-progress') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {project.status === 'active' || project.status === 'in-progress' ? 'In Progress' :
                                        project.status === 'completed' ? 'Completed' : 'Pending'}
                                </span>
                                {canEdit && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active (In Progress)</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Attachments</label>
                                <input
                                    type="file"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    )}

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
                                        {assignedUser.name ? assignedUser.name.charAt(0) : '?'}
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
            </div >
        </div >
    );
};

export default ProjectDetails;
