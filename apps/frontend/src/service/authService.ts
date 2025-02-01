import apiService from './apiService';

export const login = async (username: string, password: string) => {
    try {
        const response = await apiService.post('/auth/login', { username, password });
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Login failed' };
    }
};

export const autoLogin = async () => {
    try {
        const response = await apiService.post('/auth/login');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Auto login failed' };
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
        const response = await apiService.post('/auth/logout');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Logout failed' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiService.get('/auth/user');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const sendEmailCode = async () => {
    try {
        const response = await apiService.get('/auth/user');
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const verifyCode = async () => {
    try {
        const response = await apiService.get('/auth/user');
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
}

export default authService;