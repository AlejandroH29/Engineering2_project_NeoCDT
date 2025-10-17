import { useState } from "react"
import { FormButton } from "../components/FormButton";
import { Popup } from "../components/Popup";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"

export const RequestForm = () => {

    const [form, setForm] = useState({ value: "", months: "3" });
    const [showSummary, setShowSummary] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleSimulate = (e) => {
        e.preventDefault();
        const val = Number(form.value);
        if (!val || val <= 0) {
            alert("Por favor ingresa un value válido mayor que 0");
            return;
        }
        setShowSummary(true);
    }

    const handleConfirm = () => {
        setShowSummary(false);
        navigate("/my-requests");
    }

    const handleCancel = () => {
        if (form.value || form.months) {
            setShowSummary(false);
            navigate("/my-requests");
            return;
        }
        navigate("/my-requests");
    }

    const formattedCurrency = (n) => {
        try {
            return Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP" });
        } catch (e) {
            return n;
        }
    }

    return (
        <div className="form-container">
            <h1 className="app-title">NeoCDT</h1>
            <h2 className="page-subtitle">Simulador de CDT</h2>
            <form className="form" onSubmit={handleSimulate}>
                <label htmlFor="value">value a invertir</label>
                <input
                    type="number"
                    placeholder="Ingresa el value (ej. 1000000)"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                />

                <label htmlFor="months">Plazo (months)</label>
                <select name="months" value={form.months} onChange={handleChange}>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                </select>

                <FormButton text={"Simular"} />
                <button onClick={handleCancel} type="button">Cancelar</button>
            </form>

            {showSummary && (
                <Popup
                    text={
                        `Resumen de simulación:\nvalue: ${formattedCurrency(form.value)}\nPlazo: ${form.months} months`}
                    onSuccess={handleConfirm}
                    onClose={() => setShowSummary(false)}
                    successText={"Confirmar simulación"}
                    closeText={"Cerrar"}
                />
            )}
        </div>
    )
}
