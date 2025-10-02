import { useState } from "react"
import { FormButton } from "../components/FormButton";

export const CreateAgent = () => {

    const [agentData, setAgentData] = useState({email: "", password: "", confirmPassword: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAgentData({...agentData,  [name]: value});
    }

    return (
        <div className="form-container">
            <form className="form">
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
                <label htmlFor="confirmPassword">Confirma la contraseña</label>
                <input
                type="confirmPassword"
                name='confirmPassword'
                value={agentData.confirmPassword}
                onChange={handleChange}
                />
                <FormButton
                text={"Crear Agente"}
                />
                <FormButton
                text={"Cancelar"}
                />
            </form>
        </div>
    )
}
