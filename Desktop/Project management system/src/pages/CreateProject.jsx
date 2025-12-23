import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import userService from '../services/userService';

const CreateProject = () => {
    const navigate = useNavigate();
    // const { addProject } = useProjects(); // Use service directly for formdata support
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '', // Added as per curl
        endDate: '',   // Mapped to dueDate
        assignedUsers: '', // String as per curl hint (or ID)
        attachments: '', // Placeholder for file
        status: 'active'
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        userService.getAllUsers().then(data => setUsers(data)).catch(err => console.error(err));
        // Default dates
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, startDate: today, endDate: today }));
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        data.append('assignedUsers', formData.assignedUsers);
        // Note: curl said 'assignedUsers=string', assuming it takes an ID or comma-sep IDs.
        // My UI uses single select for now, I'll send that ID.
        if (file) {
            data.append('attachments', file); // curl said 'attachments=string', usually this implies file or file path. sending file object.
        }

        try {
            await projectService.createProject(data);
            navigate('/projects');
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Project Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Start Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">End Date (Due)</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Assign To</label>
                            <select
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={formData.assignedUsers}
                                onChange={(e) => setFormData({ ...formData, assignedUsers: e.target.value })}
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id || user._id} value={user.id || user._id}>{user.name} ({user.email})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Attachments</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
