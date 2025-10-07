import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import "../styles/form.css"
import { FormButton } from '../components/FormButton';

export const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({numberId: 0, nombre: "", tipoIdentificacion: "", email: "", password: "", tipo:"Cliente"})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/");
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Register</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="numberId">Numero de documento</label>
                <input
                type="number"
                placeholder='Ingresa tu número de cocumento'
                name='numberId'
                value={formData.numberId}
                onChange={handleChange}
                required
                />
                <label htmlFor='nombreCompleto'>Nombre completo</label>
                <input
                type='text'
                placeholder='Ingresa tu nombre completo'
                name='nombre'
                value={formData.nombre}
                onChange={handleChange}
                />
                <label htmlFor="tipoIdentificacion">Tipo de identificacion</label>
                <select name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange}>
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                </select>
                <label htmlFor="email">Correo electrónico</label>
                <input
                type="email"
                placeholder='Ingresa tu correo electrónico'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                />
                <label htmlFor="password">Contraseña</label>
                <input
                type="password"
                placeholder='Ingresa tu contraseña'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                />
                <FormButton
                text={"Registrarse"}
                onClick={handleSubmit}
                />
                <p className="link">
                    ¿Ya tienes una cuenta?{" "}
                    <a onClick={() => navigate("/")}>Login</a>
                </p>
                <p onClick={() => navigate("/create-agent")} >CREAR AGENTE</p>
            </form>
        </div>
    )
}