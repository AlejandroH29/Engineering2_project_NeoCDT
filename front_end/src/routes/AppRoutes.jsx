import { Login } from "../pages/Login"
import { Register } from "../pages/register"
import {Route, Routes} from "react-router-dom"

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
            </Routes>
        </>
    )
}
