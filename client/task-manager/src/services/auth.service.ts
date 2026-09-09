const AUTH_URL = 'https://task-manager-api-kw35.onrender.com/auth';

type Credentials = {
    username: string,
    password: string
};

export const authService = {
    // Register User
    register: async (credentials: Credentials) => {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    // Login user and save token
    login: async (credentials: Credentials) => {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    // Get current logged-in user profile (/auth/me)
    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${AUTH_URL}/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        // Fixed: Clear token only if request fails (!response.ok)
        if (!response.ok) {
            localStorage.removeItem('token');
            return null;
        }

        return response.json();
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
    }
};