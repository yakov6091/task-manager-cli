import { useState } from "react";
import { authService } from "../services/auth.service";
import { AuthModal } from "./AuthModal";
interface UserCredentials {
    username: string,
}
interface HeaderProps {
    currentUser: UserCredentials | null,
    onLoginSuccess: (user: UserCredentials) => void,
    onLogout: () => void,
}

export function Header({ currentUser, onLoginSuccess, onLogout }: HeaderProps) {
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    // const [error, setError] = useState<string | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

    // const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     setError(null);

    //     try {
    //         if (authMode === 'login') {
    //             // Call authService to save the token to localStorage 
    //             const data = await authService.login({ username, password });

    //             // Notify parent component that login succeeded
    //             onLoginSuccess(data.user || { username });

    //         } else if (authMode === 'signup') {
    //             // Register user and then log them in automatically
    //             await authService.register({ username, password });
    //             const data = await authService.login({ username, password });
    //             onLoginSuccess(data.user || { username });
    //         }
    //         // Clear inputs
    //         setUsername('');
    //         setPassword('');
    //         setAuthMode(null);

    //     } catch (err: any) {
    //         setError(err.message || 'An error occurred');
    //     }

    // };

    return (
        <header className="flex justify-between items-center text-white bg-blue-700 px-8 py-6 shadow-lg">
            <h2 className="text-2xl font-bold">Task-Manager</h2>

            {/* <AuthModal
                mode={authMode ?? 'login'}
                onClose={() => setAuthMode(null)}
                onLoginSuccess={(user: any) => onLoginSuccess(user)}
            /> */}

            {/* If user is logged in, display profile info and logout */}
            {currentUser ? (
                <div className="flex items-center gap-4">
                    <span className="font-medium text-blue-100">Hello, <strong className="text-white">{currentUser.username}</strong>!</span>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setAuthMode("login");
                        }}
                        className="px-5 py-2 bg-white text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
                    >
                        Sign in
                    </button>

                    <button
                        onClick={() => {
                            setAuthMode("signup");
                        }}
                        className="px-5 py-2 bg-white text-blue-400 rounded-lg font-semibold hover:bg-gray-400 transition-all cursor-pointer"
                    >
                        Sign up
                    </button>
                </div>
            )}

            {authMode && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setAuthMode(null)}
                    onSuccess={(user) => {
                        onLoginSuccess(user)
                        setAuthMode(null)
                    }}
                />
            )}
        </header>
    );
}