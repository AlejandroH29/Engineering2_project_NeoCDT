import { useState, useContext } from "react"
import { FormButton } from "../components/FormButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import "../styles/form.css"

export const RequestForm = () => {
    const { currentUser } = useContext(AuthContext);
    const [form, setForm] = useState({ 
        montoInicial: "", 
        tiempo: "3"
    });
    const [showSummary, setShowSummary] = useState(false);
    const [solicitudData, setSolicitudData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (!currentUser?.numeroIdentificacion) {
            alert("Error: Usuario no autenticado");
            navigate("/");
            return;
        }
        try {
            // Convertir a string si es número
            const numUsuario = String(currentUser.numeroIdentificacion);
            const response = await axios.post(
                "http://localhost:3000/solicitudes/crearSolicitudEnValidacion",
                {
                    montoInicial: form.montoInicial,
                    tiempo: form.tiempo,
                    numUsuario: String(currentUser.numeroIdentificacion)
                }
            );
            setSolicitudData(response.data);
            setShowSummary(true);
            alert("Solicitud enviada con éxito");
            navigate("/my-requests");
        } catch (err) {
            alert(err?.response?.data?.error || "Error al enviar la solicitud");
        }
    }

    const handleDraft = async (e) =>{
        e.preventDefault();
        if (!currentUser?.numeroIdentificacion) {
            alert("Error: Usuario no autenticado");
            navigate("/");
            return;
        }
        try {
            // Convertir a string si es número
            const numUsuario = String(currentUser.numeroIdentificacion);
            const response = await axios.post(
                "http://localhost:3000/solicitudes/crearSolicitudEnBorradorCDT",
                {
                    montoInicial: form.montoInicial,
                    tiempo: form.tiempo,
                    numUsuario: String(currentUser.numeroIdentificacion)
                }
            );
            setSolicitudData(response.data);
            alert("Solicitud guardada como borrador con éxito");
            navigate("/my-requests");
        } catch (err) {
            alert(err?.response?.data?.error || "Error al guardar el borrador");
        }
    }

    const handleCancel = () => {
        if (form.value || form.months) {
            setShowSummary(false);
            navigate("/my-requests");
            return;
        }
        navigate("/my-requests");
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Simulador de CDT</h2>
            <form className="form">
                <label htmlFor="montoInicial">Valor a invertir</label>
                <input
                    type="number"
                    placeholder="Ingresa el monto inicial (ej. 1000000)"
                    name="montoInicial"
                    value={form.montoInicial}
                    onChange={handleChange}
                />

                <label htmlFor="tiempo">Plazo</label>
                <select name="tiempo" value={form.tiempo} onChange={handleChange}>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="9">9 meses</option>
                    <option value="12">12 meses</option>
                </select>

                <FormButton text={"Enviar"} onClick={handleConfirm}/>
                <FormButton text={"Borrador"} onClick={handleDraft}/>
                <button onClick={handleCancel} type="button">Cancelar</button>
            </form>
        </div>
    )
}
