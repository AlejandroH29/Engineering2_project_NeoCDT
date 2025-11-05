import {useContext, useEffect, useState, useRef} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RequestCard } from '../components/RequestCard'
import { Popup } from '../components/Popup'
import "../styles/form.css"
import "../styles/table.css"

export const MyRequests = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext)
    const [myRequests, setMyRequests] = useState([]);
    const [showConfirmCancelPopup, setShowConfirmCancelPopup] = useState(false);
    const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const actionTargetRef = useRef(null); // request number being acted on
    const successModeRef = useRef(""); // 'cancel' | 'delete'
    const errorModeRef = useRef(""); // 'cancel' | 'delete' | 'load'

    const fetchRequests = async () => {
        if (!currentUser?.numeroIdentificacion) return;
        
        try {
            const response = await axios.get(
                `http://localhost:3000/solicitudes/listarSolicitudesUsuario/${currentUser.numeroIdentificacion}`
            );
            setMyRequests(response.data);
        } catch (error) {
            alert(error?.response?.data?.error || "Error al cargar las solicitudes");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentUser])

    const handleEdit = (requestNumber) => {
        navigate(`/request-form?numero=${requestNumber}`);
    }

    const handleCancel = (requestNumber) => {
        actionTargetRef.current = requestNumber;
        setShowConfirmCancelPopup(true);
    }

    const performCancel = async (requestNumber) => {
        setShowConfirmCancelPopup(false);
        try {
            await axios.put(`http://localhost:3000/solicitudes/cancelarSolicitudCDT/${requestNumber}`);
            successModeRef.current = 'cancel';
            setShowSuccessPopup(true);
            fetchRequests();
        } catch (error) {
            console.error(error);
            errorModeRef.current = 'cancel';
            setShowErrorPopup(true);
        }
    }

    const handleDelete = (requestNumber) => {
        actionTargetRef.current = requestNumber;
        setShowConfirmDeletePopup(true);
    }

    const performDelete = async (requestNumber) => {
        setShowConfirmDeletePopup(false);
        try {
            await axios.delete(`http://localhost:3000/solicitudes/eliminarSolicitudCDT/${requestNumber}`);
            successModeRef.current = 'delete';
            setShowSuccessPopup(true);
            fetchRequests();
        } catch (error) {
            console.error(error);
            errorModeRef.current = 'delete';
            setShowErrorPopup(true);
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    return (
        <div className="form-container">
            <h1 className="app-title">Mis Solicitudes</h1>
            <h2 className="page-subtitle">Usuario: {currentUser?.nombreCompleto}</h2>
            
            {myRequests.length === 0 ? (
                <div className="empty-requests">
                    <h3 className="text-xl text-gray-600">No tienes solicitudes todavía</h3>
                </div>
            ) : (
                <div className="requests-container">
                    <div className="request-grid">
                        {myRequests.map((request) => (
                            <RequestCard
                                key={request.numero}
                                estado={request.estado}
                                monto={formatCurrency(request.montoInicial)}
                                plazo={request.tiempo}
                                interes={Math.round(request.tasaInteres*100)}
                                ganancia={formatCurrency(request.montoGanancia)}
                                onEdit={() => handleEdit(request.numero)}
                                onDelete={() => handleDelete(request.numero)}
                                onCancel={() => handleCancel(request.numero)}
                                numero={request.numero}
                            />
                        ))}
                    </div>
                </div>
            )}
            {/* Confirm cancel popup */}
            {showConfirmCancelPopup && (
                <Popup
                    text={"¿Estás seguro de cancelar esta solicitud?"}
                    onSuccess={() => performCancel(actionTargetRef.current)}
                    onClose={() => setShowConfirmCancelPopup(false)}
                    successText={"Sí"}
                    closeText={"No"}
                />
            )}

            {/* Confirm delete popup */}
            {showConfirmDeletePopup && (
                <Popup
                    text={"¿Estás seguro de eliminar esta solicitud?"}
                    onSuccess={() => performDelete(actionTargetRef.current)}
                    onClose={() => setShowConfirmDeletePopup(false)}
                    successText={"Sí"}
                    closeText={"No"}
                />
            )}

            {/* Success popup */}
            {showSuccessPopup && (
                <Popup
                    text={successModeRef.current === 'cancel' ? "Solicitud cancelada exitosamente" : "Solicitud eliminada exitosamente"}
                    onSuccess={() => setShowSuccessPopup(false)}
                    successText={"Ok"}
                />
            )}

            {/* Error popup */}
            {showErrorPopup && (
                <Popup
                    text={errorModeRef.current === 'cancel' ? "Error al cancelar la solicitud" : (errorModeRef.current === 'delete' ? "Error al eliminar la solicitud" : "Error al cargar las solicitudes")}
                    onClose={() => setShowErrorPopup(false)}
                    closeText={"Ok"}
                />
            )}
        </div>
    )
}