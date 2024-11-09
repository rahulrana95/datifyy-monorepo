// src/components/GlobalSnackbar.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbarStore } from './stores/useSnackbarStore';

const GlobalSnackbar: React.FC = () => {
    const { open, message, severity, close } = useSnackbarStore();

    // Handle Snackbar close action
    const handleClose = (
        event: React.SyntheticEvent | Event,
    ) => {
        close();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000} // 2 seconds
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Snackbar position
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;
