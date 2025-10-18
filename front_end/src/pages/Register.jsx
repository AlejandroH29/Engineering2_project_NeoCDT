import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import "../styles/form.css"
import { FormButton } from '../components/FormButton';
import axios from 'axios';

export const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({numeroIdentificacion: 0, nombreCompleto: "", tipoIdentificacion: "CC", correo: "", contrasena: "", tipo:"Cliente"})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordFormat.test(formData.contrasena)) {
            alert("La contraseña no cumple los criterios de seguridad.");
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/usuarios/crearUsuario", formData)
            alert("Usuario creado con exito")
            navigate("/")
        } catch (err) {
            alert(err?.response?.data?.error || "Error al registrar")
        }
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Register</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="numeroIdentificacion">Numero de documento</label>
                <input
                type="number"
                placeholder='Ingresa tu número de cocumento'
                name='numeroIdentificacion'
                value={formData.numeroIdentificacion}
                onChange={handleChange}
                required
                />
                <label htmlFor='nombreCompleto'>Nombre completo</label>
                <input
                type='text'
                placeholder='Ingresa tu nombre completo'
                name='nombreCompleto'
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                />
                <label htmlFor="tipoIdentificacion">Tipo de identificacion</label>
                <select name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} required>
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                </select>
                <label htmlFor="correo">Correo electrónico</label>
                <input
                type="email"
                placeholder='Ingresa tu correo electrónico'
                name='correo'
                value={formData.correo}
                onChange={handleChange}
                required
                />
                <label htmlFor="contrasena">Contraseña</label>
                <input
                type="password"
                placeholder='Ingresa tu contraseña'
                name='contrasena'
                value={formData.contrasena}
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
                <p onClick={() => navigate("/create-agent")} >CREAR AGENTE</p> {/*  QUITAR CUANDO ESTÉ LISTO */}
            </form>
        </div>
    )
}