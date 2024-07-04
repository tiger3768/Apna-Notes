import { createContext, useContext, useState } from "react";
import { apiClient, getAuthenticated, getRegistered, getVerified, sendCode, resetPassword } from "../api/ApiService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState();
    const [isModerator, setModerator] = useState(false);

    async function verify(username, verificationCode) {
        try {
            const response = await getVerified(username, verificationCode);
            if (response.status === 200) {
                if (response.data.error !== null) {
                    return { status: false, error: response.data.error };
                }
                return { status: true };
            } else {
                return { status: false, error: 'Verification Failed' };
            }
        } catch (error) {
            return { status: false, error: 'Verification Failed' };
        }
    }

    async function register(email, username, password) {
        try {
            const response = await getRegistered(email, username, password);
            if (response.status === 200) {
                if (response.data.error !== null) {
                    return { status: false, error: response.data.error };
                }
                return { status: true };
            } else {
                return { status: false, error: 'Registration Failed' };
            }
        } catch (error) {
            return { status: false, error: 'Registration Failed' };
        }
    }

    async function sendVerificationCode(username) {
        try {
            const response = await sendCode(username);
            if (response.status === 200) {
                if (response.data.error !== null) {
                    return { status: false, error: response.data.error };
                }
                return { status: true };
            } else {
                return { status: false, error: 'Resend Failed' };
            }
        } catch (error) {
            return { status: false, error: 'Resend Failed' };
        }
    }

    async function login(username, password) {
        try {
            const response = await getAuthenticated(username, password);
            if (response.status === 200) {
                if (response.data.error !== null) {
                    return { status: false, error: response.data.error };
                }
                setAuthenticated(true);
                setUsername(username);
                const bAToken = 'Bearer ' + response.data.token;
                setToken(bAToken);
                if (response.data.role === 'ADMIN') setModerator(true);
                apiClient.interceptors.request.use((config) => {
                    config.headers.Authorization = bAToken;
                    return config;
                });
                return { status: true};
            } else {
                logout();
                return { status: false, error: 'Login Failed' };
            }
        } catch (error) {
            logout();
            return { status: false, error: 'An unexpected error occurred' };
        }
    }

    async function resetUserPassword(username, password, verificationCode) {
        try {
            const response = await resetPassword(username, password, verificationCode, token.substring(7));
            if (response.status === 200) {
                if (response.data.error !== null) {
                    return { status: false, error: response.data.error };
                }
                return { status: true };
            } else {
                return { status: false, error: 'Verification Failed' };
            }
        } catch (error) {
            return { status: false, error: 'Verification Failed' };
        }
    }

    function logout() {
        setToken(null);
        setAuthenticated(false);
        setUsername(null);
        setModerator(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, verify, sendVerificationCode, resetUserPassword, username, token, isModerator }}>
            {children}
        </AuthContext.Provider>
    );
}
