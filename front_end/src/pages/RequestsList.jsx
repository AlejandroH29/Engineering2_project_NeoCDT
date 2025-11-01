import {useEffect, useState} from 'react'
import { RequestCard } from '../components/RequestCard'
import axios from "axios";

export const RequestsList = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [reload, setReload] = useState(false);

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
        try{
            await axios.put(`http://localhost:3000/solicitudes/actualizarSolicitudCDT`, {
                numero: requestNumber,
                estado: status
            });
            setReload(!reload);
        }catch (error){
            console.log(error);
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
                                    onApprove={() => handleChangeStatus("Aprobada", request.numero)}
                                    onReject={() => handleChangeStatus("Rechazada", request.numero)}
                                    />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
