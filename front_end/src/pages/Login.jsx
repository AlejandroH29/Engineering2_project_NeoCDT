import {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom"
import { FormButton } from '../components/FormButton';
import { AuthContext } from '../context/AuthContext';
import { Popup } from '../components/Popup';
import axios from 'axios';
import "../styles/form.css"

export const Login = () => {
    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({correo: "", contrasena: ""});
    const [errorPopup, setErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post("http://localhost:3000/usuarios/validarSesion", formData);
            const userData = response.data;
            alert("Sesion iniciada");
            login(userData);
            switch (userData.tipo) {
                case "Agente":
                    navigate("/agent");
                    break;
                case "Admin":
                    navigate("/admin");
                    break;
                case "Cliente":
                    navigate("/client");
                    break;
            }
        } catch (err) {
            setErrorMessage(err?.response?.data?.error);
            setErrorPopup(true);
        }
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Login</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="correo">Correo</label>
                <input
                type="email"
                placeholder='Ingresa tu correo electrónico'
                name='correo'
                onChange={handleChange}
                />
                <label htmlFor="contrasena">Contraseña</label>
                <input
                type="password"
                placeholder='Ingresa tu contraseña'
                name='contrasena'
                onChange={handleChange}
                />
                <p className="link">
                    ¿No tienes una cuenta?{" "}
                    <a onClick={() => navigate("/register")}>Register</a>
                </p>
                <FormButton
                text = "Iniciar Sesión"
                />
            </form>
            {errorPopup && <Popup
            text={errorMessage}
            onClose={() => setErrorPopup(false)}
            closeText="Ok"
            />}
        </div>
    )
}