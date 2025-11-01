import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RequestCard } from '../components/RequestCard'
import "../styles/form.css"
import "../styles/table.css"

export const MyRequests = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext)
    const [myRequests, setMyRequests] = useState([]);

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

    const handleCancel = async (requestNumber) => {
        if (!window.confirm("¿Estás seguro de cancelar esta solicitud?")) return;
        
        try {
            await axios.put(`http://localhost:3000/solicitudes/cancelarSolicitudCDT/${requestNumber}`);
            alert("Solicitud cancelada exitosamente");
            fetchRequests();
        } catch (error) {
            alert(error?.response?.data?.error || "Error al cancelar la solicitud");
        }
    }

    const handleDelete = async (requestNumber) => {
        if (!window.confirm("¿Estás seguro de eliminar esta solicitud?")) return;
        
        try {
            await axios.delete(`http://localhost:3000/solicitudes/eliminarSolicitudCDT/${requestNumber}`);
            alert("Solicitud eliminada exitosamente");
            fetchRequests();
        } catch (error) {
            alert(error?.response?.data?.error || "Error al eliminar la solicitud");
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
        </div>
    )
}