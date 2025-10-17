import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { CreateAgent } from "../pages/CreateAgent"
import {Route, Routes} from "react-router-dom"
import { ViewAdmin } from "../pages/ViewAdmin"
import { ViewAgent } from "../pages/ViewAgent"
import { ViewClient } from "../pages/ViewClient"
import { RequestForm } from "../pages/RequestForm"
import { RequestsList } from "../pages/RequestsList"
import { MyRequests } from "../pages/MyRequests"
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
                <Route path="/RequestForm" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <RequestForm/>
                } />
                <Route path="/requests-list" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <RequestsList/>
                } />
                <Route path="/my-requests" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <MyRequests/>
                } />
                <Route path="/admin" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <ViewAdmin/>
                } />
                <Route path="/agent" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <ViewAgent/>
                } />
                <Route path="/client" element={
                    // <PrivateRoute>
                    // </PrivateRoute>
                        <ViewClient/>
                } />
            </Routes>
        </>
    )
}
