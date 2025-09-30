import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import "../styles/form.css"

export const Register = () => { //AGREGAR BOTÓN GOOGLE

    const navigate = useNavigate();

    const [formData, setFormData] = useState({typeId: "", numberId: ""})

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
                <label htmlFor="typeId">Tipo de documento</label>
                <select
                type="select"
                placeholder='Ingresa tu correo nombre de usuario'
                name='typeId'
                value={formData.typeId}
                onChange={handleChange}
                >
                    <option value="none"></option>
                    <option value="T.I">T.I</option>
                    <option value="C.C">C.C</option>
                    <option value="ForeignPassport">Pasaporte Extrangero</option>
                </select>
                <label htmlFor="numberId">Numero de documento</label>
                <input
                type="number"
                placeholder='Ingresa tu número de cocumento'
                name='numberId'
                value={formData.numberId}
                onChange={handleChange}
                />
                <p className="link">
                    ¿Ya tienes una cuenta?{" "}
                    <a onClick={() => navigate("/")}>Login</a>
                </p>
            </form>
        </div>
    )
}   