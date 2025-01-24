import * as React from "react";
import { Toast } from "radix-ui";
import "./toast.css";

interface ToastDemoProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    desc: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const ToastC: React.FC<ToastDemoProps> = ({ open, setOpen, title, desc, type }) => {
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root className={`ToastRoot ${type}`} open={open} onOpenChange={setOpen}>
                <Toast.Title className="ToastTitle">{title}</Toast.Title>
                <Toast.Description asChild>
                    {desc}
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
    );
};

export default ToastC;
