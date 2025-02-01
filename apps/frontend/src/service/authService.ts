import apiService from './apiService';
import { ErrorObject } from './ErrorTypes';

export const login = async (username: string, password: string) => {
    try {
        const response: {
            response?: {
                token: string;
            },
            error?: ErrorObject
        } = await apiService.post('/login', { username, password });

        if (!response?.response?.token) {
            return { response: null, error: 'Login failed' };
        }

        const token = response.response.token;

        apiService.setTokenInCookies(token);

        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Login failed' };
    }
};

export const verifyToken = async () => {
    try {
        await apiService.getTokenFromCookies();
        const response: {
            response?: {
                id: string;
                email: string;
                isadmin: boolean;
            },
            error?: ErrorObject
        } = await apiService.post('/validate-token');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'validate-token failed' };
    }
}

export const register = async (username: string, password: string, email: string) => {
    try {
        const response = await apiService.post('/auth/register', { username, password, email });
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Registration failed' };
    }
};

export const logout = async () => {
    try {
        const response = await apiService.post('/logout');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Logout failed' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiService.get('/user');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const sendEmailCode = async () => {
    try {
        const response = await apiService.get('/user');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const verifyCode = async () => {
    try {
        const response = await apiService.get('/user');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    sendEmailCode,
    verifyCode,
    verifyToken,
}

export default authService;