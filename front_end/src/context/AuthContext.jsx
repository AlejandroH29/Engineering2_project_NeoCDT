import { createContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    const login = (user) => {
        setCurrentUser(user);
        if (currentUser) {
            navigate("/dashboard")
        }
    }

    const logout = () => {
        setCurrentUser(null);
        navigate("/");
    }

    return (
    <AuthContext.Provider
        value={{
            currentUser, setCurrentUser,
            login, logout
        }}>
        {children}
    </AuthContext.Provider>
    )
}
