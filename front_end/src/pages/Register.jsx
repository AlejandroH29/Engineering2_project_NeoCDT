import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import "../styles/form.css"
import { FormButton } from '../components/FormButton';
import { Popup } from '../components/Popup';
import axios from 'axios';

export const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({numeroIdentificacion: 0, nombreCompleto: "", tipoIdentificacion: "CC", correo: "", contrasena: "", tipo:"Cliente"})
    const [errorPopup, setErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,  [name]: value});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const idLenght = /^[0-9]{8,10}$/;
        // if(!idLenght.test(formData.numeroIdentificacion)){
        //     setErrorMessage("El número de identificación debe tener entre 7 y 10 digitos.");
        //     setErrorPopup(true);
        //     return;
        // }

        const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordFormat.test(formData.contrasena)) {
            setErrorMessage("La contraseña no cumple los criterios de seguridad.");
            setErrorPopup(true);
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/usuarios/crearUsuario", formData)
            alert("Usuario creado con exito")
            navigate("/")
        } catch (err) {
            // err.response.data.error = "Out of range value for column 'numeroIdentificacion' at row 1" ?
            // setErrorMessage("El número de identificación debe tener entre 7 y 10 digitos.") : setErrorMessage(err?.response?.data?.error);
            setErrorMessage(err?.response?.data?.error)
            setErrorPopup(true);
        }
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Register</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="tipoIdentificacion">Tipo de identificacion</label>
                <select name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} required>
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                </select>
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
            </form>
            {errorPopup && <Popup
            text={errorMessage}
            onClose={() => setErrorPopup(false)}
            closeText="Ok"
            />}
        </div>
    )
}