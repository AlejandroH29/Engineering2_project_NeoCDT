import { useState } from "react"
import { FormButton } from "../components/FormButton";
import { Popup } from "../components/Popup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const CreateAgent = () => {

    const [agentData, setAgentData] = useState({numId: 0, email: "", password: "", confirmPassword: ""});
    const [wrongFormatPopup, setWrongFormatPopup] = useState(false);
    const [unequalPasswordPopup, setUnequalPasswordPopup] = useState(false);
    const [cancelPopup, setCancelPopup] = useState(false);
    const [submitPopup, setSubmitPopup] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAgentData({...agentData,  [name]: value});
    }

    const handleCancel = () => {
        if(agentData.numId || agentData.email || agentData.password || agentData.confirmPassword){
            setCancelPopup(true);
            return;
        }
        navigate("/admin");
    }

    const handleCreateAgent = async (e) => {
        e.preventDefault();
        const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordFormat.test(agentData.confirmPassword)) {
            setWrongFormatPopup(true);
            return;
        }

        if (agentData.password !== agentData.confirmPassword){
            setUnequalPasswordPopup(true);
            return;
        }

        const newAgent = {
            numeroIdentificacion: agentData.numId,
            nombreCompleto: `Agente_${agentData.email.split("@")[0]}`,
            tipoIdentificacion: "CC",
            correo: agentData.email,
            contrasena: agentData.confirmPassword,
            tipo: "Agente"
        }
        try{
            console.log(newAgent);
            await axios.post("http://localhost:3000/usuarios/crearUsuario", newAgent);
            setSubmitPopup(true);
        }catch (error) {
            console.log(error?.response?.data?.error);
        }
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Creacion de Agente</h2>
            <form className="form">
                <label htmlFor="email">Número de documento</label>
                <input
                type="number"
                placeholder='Número de docuemnto del agente'
                name='numId'
                value={agentData.numId}
                onChange={handleChange}
                />
                <label htmlFor="email">Correo Electrónico</label>
                <input
                type="email"
                placeholder='Ingresa el correo del agente'
                name='email'
                value={agentData.email}
                onChange={handleChange}
                />
                <label htmlFor="password">Contraseña</label>
                <input
                type="password"
                placeholder='Ingresa la contraseña del agente'
                name='password'
                value={agentData.password}
                onChange={handleChange}
                />
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                type="password"
                placeholder='Confirma la contraseña del agente'
                name='confirmPassword'
                value={agentData.confirmPassword}
                onChange={handleChange}
                />
                <FormButton
                text={"Crear Agente"}
                onClick={handleCreateAgent}
                />
                <button onClick={handleCancel} type="button">Cancelar</button>  
            </form>
            {wrongFormatPopup && <Popup
            text={"La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos especiales."}
            onClose={() => setWrongFormatPopup(false)}
            closeText={"Ok"}
            />}
            {unequalPasswordPopup && <Popup
            text={"Las contraseñas no coinciden."}
            onClose={() => setUnequalPasswordPopup(false)}
            closeText={"Ok"}
            />}
            {cancelPopup && <Popup
            text="¿Estás seguro de que quieres cancelar la creacion del agente?"
            onSuccess={() => navigate("/admin")}
            onClose={() => setCancelPopup(false)}
            successText="Seguro"
            closeText="Seguir editando"
            />}
            {submitPopup && <Popup
            text={"El agente ha sido creado con éxito"}
            onSuccess={() => navigate("/admin")}
            successText={"Ok"}
            />}
        </div>
    )
}
