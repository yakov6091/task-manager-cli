import { useState } from "react";
import { authService } from "../services/auth.service";

interface AuthModalProps {
    mode: 'login' | 'signup',
    onClose: () => void,
    onLoginSuccess: (user: any) => void
}

export function AuthModal({ mode, onClose, onLoginSuccess }: AuthModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            if (mode === 'login') {
                // Call authService to save the token to localStorage 
                const data = await authService.login({ username, password });

                // Notify parent component that login succeeded
                onLoginSuccess(data.user || { username });

            } else if (mode === 'signup') {
                // Register user and then log them in automatically
                await authService.register({ username, password });
                const data = await authService.login({ username, password });
                onLoginSuccess(data.user || { username });
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred');
        }

    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-gray-800">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold"
                >
                    X
                </button>

                <h3 className="text-xl font-bold mb-4 text-blue-700">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h3>

                {error && (
                    <div className="bg-red-100 border-red-300 text-red-700 px-3 py-2 rounded mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Username:</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Password:</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all cursor-pointer mt-2"
                    >
                        {mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

            </div>
        </div>
    )
}