import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { CreateAgent } from "../pages/CreateAgent"
import {Route, Routes} from "react-router-dom"
import { ViewAdmin } from "../pages/ViewAdmin"
import { ViewAgent } from "../pages/ViewAgent"
import { ViewClient } from "../pages/ViewClient"
import { PrivateRoute } from "../components/PrivateRoute"

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/create-agent" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <CreateAgent/>
                } />
                <Route path="/admin" element={<ViewAdmin/>} />
                <Route path="/agent" element={<ViewAgent/>} />
                <Route path="/client" element={<ViewClient/>} />
            </Routes>
        </>
    )
}
