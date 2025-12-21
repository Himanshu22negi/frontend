import api from './api';

const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    getProject: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    createProject: async (projectData) => {
        // Check if input is FormData, if not, convert it or send JSON depending on backend requirement
        // Swagger said Multipart/Form-Data for create
        const response = await api.post('/projects', projectData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateProject: async (id, projectData) => {
        // Swagger said Multipart/Form-Data for update
        const response = await api.put(`/projects/${id}`, projectData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};

export default projectService;
