const URL = 'http://localhost:4000/auth';

type Credentials = {
    username: string,
    password: string
};

export const authService = {
    // Register User
    register: async (credentials: Credentials) => {
        const response = await fetch(`${URL}/register`, {
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
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();

        // Save the JWT token received from backend into localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data // Returns user info / token
    },
    // Get current logged-in user profile (/auth/me)
    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${URL}/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Token might be expired or invalid
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