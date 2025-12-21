import React, { createContext, useContext, useState, useEffect } from 'react';
import projectService from '../services/projectService';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const addProject = async (projectData) => {
        const newProject = await projectService.createProject(projectData);
        // Optimistic update or refetch. 
        // Since we return the new project from backend, we can append.
        setProjects([...projects, newProject]);
    };

    const updateProject = async (id, updates) => {
        const updatedProject = await projectService.updateProject(id, updates);
        setProjects(projects.map(p => p.id === id ? updatedProject : p));
    };

    return (
        <ProjectContext.Provider value={{ projects, loading, fetchProjects, addProject, updateProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
