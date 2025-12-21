import axios from 'axios';

// Utility to get data from local storage or default
const getStorage = (key, defaultVal) => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultVal;
    try {
        return JSON.parse(stored);
    } catch (e) {
        return defaultVal;
    }
};

const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
};

// Initial Data
const USERS_KEY = 'pms_users';
const PROJECTS_KEY = 'pms_projects';

const defaultUsers = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
    { id: '2', name: 'John Doe', email: 'user@example.com', password: 'password', role: 'user' },
];

const defaultProjects = [
    { id: '1', title: 'Website Redesign', description: 'Redesign company website', status: 'In Progress', assignedTo: '2', dueDate: '2023-12-31' },
];

// Initialize storage if empty
if (!localStorage.getItem(USERS_KEY)) setStorage(USERS_KEY, defaultUsers);
if (!localStorage.getItem(PROJECTS_KEY)) setStorage(PROJECTS_KEY, defaultProjects);

export const mockApi = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getStorage(USERS_KEY, defaultUsers);
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    const { password, ...userWithoutPass } = user;
                    resolve(userWithoutPass);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    getProjects: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getStorage(PROJECTS_KEY, defaultProjects));
            }, 300);
        });
    },

    createProject: async (project) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const projects = getStorage(PROJECTS_KEY, defaultProjects);
                const newProject = { ...project, id: Date.now().toString() };
                projects.push(newProject);
                setStorage(PROJECTS_KEY, projects);
                resolve(newProject);
            }, 300);
        });
    },

    updateProject: async (id, updates) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const projects = getStorage(PROJECTS_KEY, defaultProjects);
                const index = projects.findIndex(p => p.id === id);
                if (index !== -1) {
                    projects[index] = { ...projects[index], ...updates };
                    setStorage(PROJECTS_KEY, projects);
                    resolve(projects[index]);
                }
            }, 300);
        });
    },

    getUsers: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = getStorage(USERS_KEY, defaultUsers);
                // Return users without passwords
                resolve(users.map(({ password, ...u }) => u));
            }, 300);
        });
    },

    createUser: async (user) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = getStorage(USERS_KEY, defaultUsers);
                const newUser = { ...user, id: Date.now().toString() };
                users.push(newUser);
                setStorage(USERS_KEY, users);
                // return without password
                const { password, ...u } = newUser;
                resolve(u);
            }, 300);
        })
    }
};
