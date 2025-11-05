import {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom"
import { FormButton } from '../components/FormButton';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import "../styles/form.css"
import { Popup } from '../components/Popup';

export const Login = () => {
    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({correo: "", contrasena: ""});
    const [wrongPasswordPopup, setWrongPasswordPopup] = useState(false);
    const [correctLoginPopup, setCorrectLoginPopup] = useState(false)
    const [userType, setUserType] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post("http://localhost:3000/usuarios/validarSesion", formData);
            const userData = response.data;
            login(userData);
            setUserType(userData.tipo);
            setCorrectLoginPopup(true);
        } catch (err) {
            err?.response?.data?.error === "Contraseña incorrecta" ? setWrongPasswordPopup(true) : console.log(err);
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
                placeholder='Ingresa tu correo de agente'
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
            {wrongPasswordPopup && <Popup
            text="Contraseña incorrecta."
            onClose={() => setWrongPasswordPopup(false)}
            closeText="Ok"
            />}
            {correctLoginPopup && (
            <Popup
                text={"Inicio de sesión correcto."}
                onSuccess={() => {
                    // cerrar popup
                    setCorrectLoginPopup(false);
                    switch (userType) {
                        case "Agente":
                            navigate("/agent");
                            break;
                        case "Admin":
                            navigate("/admin");
                            break;
                        case "Cliente":
                            navigate("/client");
                            break;
                        default:
                            navigate("/");
                    }
                }}
                successText={"Ok"}
            />
            )}
        </div>
    )
}