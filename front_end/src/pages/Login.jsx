import {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom"
import { FormButton } from '../components/FormButton';
import { AuthContext } from '../context/AuthContext';
import "../styles/form.css"

export const Login = () => {
    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({email: "", password: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Login</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="email">Correo</label>
                <input
                type="email"
                placeholder='Ingresa tu correo de agente'
                name='email'
                onChange={handleChange}
                />
                <label htmlFor="password">Contraseña</label>
                <input
                type="password"
                placeholder='Ingresa tu contraseña'
                name='password'
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
        </div>
    )
}