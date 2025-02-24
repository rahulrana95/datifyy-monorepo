import apiService from './apiService';
import { ErrorObject } from './ErrorTypes';

export const login = async (username: string, password: string) => {
    try {
        const response: {
            response?: {
                token: string;
            },
            error?: ErrorObject
        } = await apiService.post('/login', { email:username, password });

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
                firstName: string;
                officialEmail: string;
                isadmin: boolean;
            },
            error?: ErrorObject
        } = await apiService.post('/validate-token');
        if (response.error) {
            return { response: null, error: 'validate-token failed' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'validate-token failed' };
    }
}

export const register = async ( password: string, email: string) => {
    try {
        const response = await apiService.post('/signup', { password, email });
        if (response.error) { 
            return { response: null, error: 'Registration failed' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Registration failed' };
    }
};

export const logout = async () => {
    try {
        const response = await apiService.post('/logout');

        if (response.error) { 
            return { response: null, error: 'Logout failed.' };
        }

        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Logout failed' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response: {
            response?: {
                data: {id: string;
                    officialEmail: string;
                firstName: string
                isadmin: boolean;}
            },
            error?: ErrorObject
        } = await apiService.get('/user-profile');
        if (response.error) { 
            return { response: null, error: 'Failed to fetch current user' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const sendEmailCode = async ({ to, type }: { to: {email: string, name: string}[], type: "verifyEmail" | "forgotPassword"}) => {
    try {
        const response = await apiService.post('/send-emails', {to, type});
        if (response.error) { 
            return { response: null, error: 'Something is wrong.' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};

export const verifyEmailCode = async ({email, verificationCode}: {email: string, verificationCode: string}) => {
    try {
        const response = await apiService.post('/verify-email-code', {email, verificationCode} );
        if (response.error) { 
            return { response: null, error: 'Something is wrong.' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
};


export const sendForgotPasswordCode = async (email: string) => {
    try {
        const response = await apiService.post('/forgot-password/send-verification-code', {email});
        if (response.error) { 
            return { response: null, error: 'Something is wrong.' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
}

export const verifyForgotPasswordCode = async ({ email, verificationCode }: { email: string, verificationCode: string }) => {
    try {
        const response = await apiService.post('/forgot-password/verify-code', { email, verificationCode });
        if (response.error) { 
            return { response: null, error: 'Something is wrong.' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
}

export const resetPassword = async ({ email, password }: { email: string, password: string }) => {
    try {
        const response = await apiService.post('/forgot-password/reset-password', { email, password });
        if (response.error) { 
            return { response: null, error: 'Something is wrong.' };
        }
        return { response: response.response, error: null };
    } catch (error) {
        return { response: null, error: 'Failed to fetch current user' };
    }
}


const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    sendEmailCode,
    verifyEmailCode,
    verifyToken,
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
    resetPassword
}

export default authService;