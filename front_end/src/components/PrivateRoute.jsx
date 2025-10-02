import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export const PrivateRoute = () => {
    const {currentUser} = useContext(AuthContext);

    if(!currentUser){
        return <Navigate to="/" replace/>
    }
    
    return children;
}
