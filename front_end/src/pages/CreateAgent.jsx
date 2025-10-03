import { useState } from "react"
import { FormButton } from "../components/FormButton";
import { Popup } from "../components/Popup";
import { useNavigate } from "react-router-dom";

export const CreateAgent = () => {

    const [agentData, setAgentData] = useState({numId: 0, email: "", password: "", confirmPassword: ""});
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
        navigate("/dashboard");
    }

    const handleCreateAgent = (e) => {
        e.preventDefault();
        setSubmitPopup(true);
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Creacion de Agente</h2>
            <form className="form">
                <label htmlFor="email">Número de documento</label>
                <input
                type="numId"
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
                placeholder='Ingresa La contraseña del agente'
                name='password'
                value={agentData.password}
                onChange={handleChange}
                />
                <FormButton
                text={"Crear Agente"}
                onClick={handleCreateAgent}
                />
                <button onClick={handleCancel} type="button">Cancelar</button>  
            </form>
            {cancelPopup && <Popup
            text="¿Estás seguro de que quieres cancelar la creacion del agente?"
            onSuccess={() => navigate("/dashboard")}
            onClose={() => setCancelPopup(false)}
            successText="Seguro"
            closeText="Seguir editando"
            />}
            {submitPopup && <Popup
            text={"El agente ha sido creado con éxito"}
            onSuccess={() => navigate("/dashboard")}
            successText={"Ok"}
            />}
        </div>
    )
}
