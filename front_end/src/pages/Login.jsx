import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import { FormButton } from '../components/formButton';

export const Login = () => { //AGREGAR BOTÓN GOOGLE

    const navigate = useNavigate();

    const [formData, setFormData] = useState({email: "", password: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }

    const handleSubmit = (e) => {
        e.prevendDrfault();
        navigate("/dashboard");
    }

    return (
        <div>
            <h1>Login</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="email">Correo</label>
                <input
                type="email"
                placeholder='Ingresa tu correo de agente'
                name='email'
                onChange={handleChange}
                />
                <p><small>Nota: Este campo es exclusivo de los agentes, si eres usuario cliente ignoralo</small></p>
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