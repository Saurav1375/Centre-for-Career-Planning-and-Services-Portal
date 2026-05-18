import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {

    const initialUrl = import.meta.env.VITE_BACKEND_URL || "";
    const backendUrl = initialUrl === "/api" ? "" : initialUrl;
    const [backendUrlState] = useState(backendUrl);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [showAddThread, setShowAddThread] = useState(false);

    return <AppContext.Provider value={{ backendUrl: backendUrlState, showForgotPassword, setShowForgotPassword, showVerifyEmail, setShowVerifyEmail, showAddThread, setShowAddThread }}>{children}</AppContext.Provider>;
};
