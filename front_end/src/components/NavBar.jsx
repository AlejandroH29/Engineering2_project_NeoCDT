import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosLogOut } from "react-icons/io";
import { HiOutlineHome } from "react-icons/hi2";
import "../styles/NavBar.css"
import { Popup } from "./Popup";

export const NavBar = () => {
    const {logout, currentUser} = useContext(AuthContext);

    const navigate = useNavigate();

    const [logoutPopup, setLogoutPopup] = useState();

    const navigateToRoleHome = () => {
        switch (currentUser.tipo){
            case "Agente":
                return navigate("/agent");
            case "Cliente":
                return navigate("/client");
            case "Admin":
                return navigate("/admin");
        }
    }

    return (
        <>
            <nav className="navbar" >
                <div>
                    <IoIosArrowBack className="arrowBack"
                    onClick={() => navigate(-1)}
                    />
                </div>
                <div className="nav-items" >
                    <p onClick={() => navigate("/")} >Inicio de sesión</p>
                    <HiOutlineHome className="home" onClick={navigateToRoleHome}/>
                    <p onClick={() => navigate("/register")} >Registro</p>
                </div>
                <div>
                    <IoIosLogOut className="logOutIcon"
                    onClick={() => setLogoutPopup(true)}
                    />
                </div>
            </nav>
            {logoutPopup && <Popup
            text="¿Seguro que quieres cerrar sesión?"
            onSuccess={logout}
            successText="Si"
            onClose={() => setLogoutPopup(false)}
            closeText="No"
            />}
        </>
    )
}
