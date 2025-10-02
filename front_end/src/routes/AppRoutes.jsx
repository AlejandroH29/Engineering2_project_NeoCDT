import { Login } from "../pages/Login"
import { Register } from "../pages/register"
import { CreateAgent } from "../pages/CreateAgent"
import {Route, Routes} from "react-router-dom"
import { PrivateRoute } from "../components/PrivateRoute"

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/create-agent" element={
                    <PrivateRoute>
                        <CreateAgent/>
                    </PrivateRoute>
                } />
            </Routes>
        </>
    )
}
