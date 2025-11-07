import { useState, useContext, useEffect, useRef } from "react"
import { FormButton } from "../components/FormButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import "../styles/form.css"
import { Popup } from '../components/Popup';

export const RequestForm = () => {
    const { currentUser } = useContext(AuthContext);
    const [amountAlert, setAmountAlert] = useState(false);
    const [form, setForm] = useState({montoInicial: "", tiempo: "3"});

    const [showSummary, setShowSummary] = useState(false);
    const [solicitudData, setSolicitudData] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const successModeRef = useRef(""); // 'enviado' | 'borrador'
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const errorTypeRef = useRef(""); // 'unauth' | 'generic'
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestNumber = searchParams.get("numero")
    const [completeData, setCompleteData] = useState(false)

    useEffect(() => {
        const getDraftData = async () => {
            if (!requestNumber)return;
            try{
                const borrador = await axios.get(`http://localhost:3000/solicitudes/listarSolicitudBorrador/${requestNumber}`);
                setForm(borrador.data);
            }catch (error){
                console.log(error);
            }
        }   
        getDraftData();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "montoInicial"){
            const cleanedValue = value.replace(/\D/g, ""); //Reemplaza todo lo que no sea un digito con ""
            const numericValue = cleanedValue ? Number(cleanedValue) : "";
            numericValue < 1000000 ? setAmountAlert(true) : setAmountAlert(false);
            setForm(prev => ({...prev, [name]: numericValue}));
        }else{
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (!form.montoInicial && form.montoInicial !== 0) {
            setCompleteData(true);
            return;
        }
        if (!currentUser?.numeroIdentificacion) {
            errorTypeRef.current = "unauth";
            setShowErrorPopup(true);
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
                    numUsuario,
                    ...(form.numero ? { numero: form.numero } : {})
                }
            );
            setSolicitudData(response.data);
            setShowSummary(true);
            successModeRef.current = "enviado";
            setShowSuccessPopup(true);
        } catch (err) {
            console.error(err);
            errorTypeRef.current = "generic";
            setShowErrorPopup(true);
        }
    }

    const handleDraft = async (e) =>{
        e.preventDefault();
        if (!currentUser?.numeroIdentificacion) {
            errorTypeRef.current = "unauth";
            setShowErrorPopup(true);
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
                    numUsuario,
                    ...(form.numero ? { numero: form.numero } : {})
                }
            );
            setSolicitudData(response.data);
            successModeRef.current = "borrador";
            setShowSuccessPopup(true);
        } catch (err) {
            console.error(err);
            errorTypeRef.current = "generic";
            setShowErrorPopup(true);
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
                    type="text"
                    placeholder="Ingresa el monto inicial (ej. 1'000,000)"
                    name="montoInicial"
                    value={form.montoInicial}
                    onChange={handleChange}
                />
                {amountAlert && (
                    <small className="tiny-alert">El monto debe ser de al menos 1'000.000</small>
                )}

                <label htmlFor="tiempo">Plazo</label>
                <select name="tiempo" value={form.tiempo} onChange={handleChange}>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="9">9 meses</option>
                    <option value="12">12 meses</option>
                </select>

                <FormButton text={"Enviar"} onClick={handleConfirm}/>
                <FormButton text={"Borrador"} onClick={handleDraft}/>
                <FormButton text={"Cancelar"} onClick={handleCancel}/>
            </form>
                {showSuccessPopup && (
                    <Popup
                        text={successModeRef.current === "enviado" ? "Solicitud enviada con éxito" : "Solicitud guardada como borrador con éxito"}
                        onSuccess={() => {
                            setShowSuccessPopup(false);
                            navigate("/my-requests");
                        }}
                        successText={"Ok"}
                    />
                )}

                {showErrorPopup && (
                    <Popup
                        text={errorTypeRef.current === "unauth" ? "Error: Usuario no autenticado" : "Ocurrió un error al procesar la solicitud"}
                        onClose={() => {
                            setShowErrorPopup(false);
                            // si es por usuario no autenticado, redirigir al inicio
                            if (errorTypeRef.current === "unauth") {
                                navigate("/");
                            }
                        }}
                        closeText={"Ok"}
                    />
                )}
                {completeData && (
                    <Popup
                        text = {"El campo debe estar lleno"}
                        onClose={()=> setCompleteData(false)}
                        closeText={"Ok"}
                    />
                )}
        </div>
    )
}
