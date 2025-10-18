import { useState } from "react"
import { FormButton } from "../components/FormButton";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"

export const RequestForm = () => {

    const [form, setForm] = useState({ value: "", months: "3" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/solicitud", form)
            alert("Solicitud enviada con exito")
            navigate("/my-requests")
        } catch (err) {
            alert(err?.response?.data?.error || "Error al registrar")
        }
    }

    const handleDraft = async (e) =>{
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/solicitud", form)
            alert("Solicitud guardada como borrador con exito")
            navigate("/my-requests")
        } catch (err) {
            alert(err?.response?.data?.error || "Error al registrar")
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
                <label htmlFor="value">Valor a invertir</label>
                <input
                    type="number"
                    placeholder="Ingresa el value (ej. 1000000)"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                />

                <label htmlFor="months">Plazo</label>
                <select name="months" value={form.months} onChange={handleChange}>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="9">9 meses</option>
                    <option value="12">12 months</option>
                </select>

                <FormButton text={"Enviar"} onClick={handleConfirm}/>
                <FormButton text={"Borrador"} onClick={handleDraft}/>
                <button onClick={handleCancel} type="button">Cancelar</button>
            </form>
        </div>
    )
}
