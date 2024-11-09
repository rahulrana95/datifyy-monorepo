import { Snackbar, Alert } from "@mui/material";
import React, { useState, useCallback } from "react";


// Singleton for managing Snackbar state
class SnackbarUtils {
    private static instance: SnackbarUtils;
    private snackbarRef: React.RefObject<any> | null = null;

    private constructor() { }

    static getInstance(): SnackbarUtils {
        if (!SnackbarUtils.instance) {
            SnackbarUtils.instance = new SnackbarUtils();
        }
        return SnackbarUtils.instance;
    }

    setSnackbarRef(ref: React.RefObject<any>) {
        this.snackbarRef = ref;
    }

    show(message: string, severity: "success" | "error" | "info" | "warning") {
        if (this.snackbarRef?.current) {
            this.snackbarRef.current.showSnackbar(message, severity);
        }
    }
}

const snackbarUtils = SnackbarUtils.getInstance();

export const useSnackbarUtils = () => {
    return snackbarUtils;
};

export default snackbarUtils;



// Snackbar component that can be used globally
export const SnackbarProvider: React.FC<{ children: any }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("info");

    const showSnackbar = (msg: string, severity: "success" | "error" | "info" | "warning") => {
        setMessage(msg);
        setSeverity(severity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Set the ref for global access
    React.useEffect(() => {
        snackbarUtils.setSnackbarRef({ current: { showSnackbar } });
    }, []);

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <><Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
                {children}
            </>
        </Snackbar >
    );
};

