import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./login-signup/authStore";

const PrivateRoute = ({ component }: { component: any }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    console.log({ isAuthenticated });

    return isAuthenticated ? component : <Navigate to="/" replace />;
};

export default PrivateRoute;
