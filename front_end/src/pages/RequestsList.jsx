import {useEffect, useState, useRef} from 'react'
import { RequestCard } from '../components/RequestCard'
import axios from "axios";
import { Popup } from '../components/Popup';

export const RequestsList = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [reload, setReload] = useState(false);
    const [showConfirmApprovePopup, setShowConfirmApprovePopup] = useState(false);
    const [showConfirmRejectPopup, setShowConfirmRejectPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const actionTargetRef = useRef(null);
    const successModeRef = useRef(""); // 'approve' | 'reject'
    const errorModeRef = useRef("");

    useEffect(() => {
        const listarSolicitudesPendientes = async () => {
            try{
                const pendientes = await axios.get("http://localhost:3000/solicitudes/listarSolicitudesCDTPendientes");
                setPendingRequests(pendientes.data);
            }catch (error){
                console.log(error);
            }
        }
        listarSolicitudesPendientes();
    }, [reload]);

    const handleChangeStatus = async (status, requestNumber) => {
        await axios.put(`http://localhost:3000/solicitudes/actualizarSolicitudCDT`, {
            numero: requestNumber,
            estado: status
        });
        setReload(!reload);
    }

    const handleApprove = (requestNumber) => {
        actionTargetRef.current = requestNumber;
        setShowConfirmApprovePopup(true);
    }

    const performApprove = async (requestNumber) => {
        setShowConfirmApprovePopup(false);
        try{
            await handleChangeStatus("Aprobada", requestNumber);
            successModeRef.current = 'approve';
            setShowSuccessPopup(true);
        } catch(err) {
            console.error(err);
            errorModeRef.current = 'approve';
            setShowErrorPopup(true);
        }
    }

    const handleReject = (requestNumber) => {
        actionTargetRef.current = requestNumber;
        setShowConfirmRejectPopup(true);
    }

    const performReject = async (requestNumber) => {
        setShowConfirmRejectPopup(false);
        try{
            await handleChangeStatus("Rechazada", requestNumber);
            successModeRef.current = 'reject';
            setShowSuccessPopup(true);
        } catch(err) {
            console.error(err);
            errorModeRef.current = 'reject';
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
        <div>
            <h1 className="app-title" >Solicitudes por revisar</h1>
            <div>
                {pendingRequests.length === 0 ? (
                    <div className="empty-requests">
                        <h3 className="text-xl text-gray-600">No hay solicitudes por resivar</h3>
                    </div>
                ) : (
                    <div className="requests-container">
                        <div className="request-grid">
                            {pendingRequests.map((request) => (
                                    <RequestCard
                                    numero={request.numero}
                                    key={request.numero} 
                                    plazo={request.tiempo}
                                    interes={Math.round(request.tasaInteres*100)}
                                    monto={formatCurrency(request.montoInicial)}
                                    ganancia={formatCurrency(request.montoGanancia)}
                                    onApprove={() => handleApprove(request.numero)}
                                    onReject={() => handleReject(request.numero)}
                                    />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {showConfirmApprovePopup && (
                <Popup
                    text={"¿Estás seguro de aprobar esta solicitud?"}
                    onSuccess={() => performApprove(actionTargetRef.current)}
                    onClose={() => setShowConfirmApprovePopup(false)}
                    successText={"Sí"}
                    closeText={"No"}
                />
            )}

            {showConfirmRejectPopup && (
                <Popup
                    text={"¿Estás seguro de rechazar esta solicitud?"}
                    onSuccess={() => performReject(actionTargetRef.current)}
                    onClose={() => setShowConfirmRejectPopup(false)}
                    successText={"Sí"}
                    closeText={"No"}
                />
            )}

            {showSuccessPopup && (
                <Popup
                    text={successModeRef.current === 'approve' ? "Solicitud aprobada correctamente" : "Solicitud rechazada correctamente"}
                    onSuccess={() => setShowSuccessPopup(false)}
                    successText={"Ok"}
                />
            )}

            {showErrorPopup && (
                <Popup
                    text={errorModeRef.current === 'approve' ? "Error al aprobar la solicitud" : "Error al rechazar la solicitud"}
                    onClose={() => setShowErrorPopup(false)}
                    closeText={"Ok"}
                />
            )}
        </div>
    )
}
