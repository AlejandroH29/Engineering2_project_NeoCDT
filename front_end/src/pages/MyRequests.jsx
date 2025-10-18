import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { RequestCard } from '../components/RequestCard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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

    const handleEdit = () => {
        navigate("/request-form");
    }

    const handleCancel = async (requestNumber) => {
        try {
            await axios.put(`http://localhost:3000/solicitudes/cancelarSolicitudCDT/${requestNumber}`);
            alert("Solicitud cancelada exitosamente");
            fetchRequests(); // Actualizar la lista después de cancelar
        } catch (error) {
            alert(error?.response?.data?.error || "Error al cancelar la solicitud");
        }
    }

    const handleDelete = async (requestNumber) => {
        try {
            await axios.delete(`http://localhost:3000/solicitudes/eliminarSolicitudCDT/${requestNumber}`);
            alert("Solicitud eliminada exitosamente");
            fetchRequests(); // Actualizar la lista después de eliminar
        } catch (error) {
            alert(error?.response?.data?.error || "Error al eliminar la solicitud");
        }
    }


    return (
        <div>
            <h1>Solicitudes de {currentUser.nombre}</h1>
            <div>
                {myRequests.length === 0 ? (
                    <h3>No tienes solicitudes todavia</h3>
                ) : (
                    myRequests.map((request) => (
                        <div key={request.numero} >
                            <RequestCard
                            estado={request.estado}
                            plazo={request.tiempo}
                            monto={request.montoInicial}
                            onDelete={handleDelete}
                            onEdit={() => handleEdit(request.numero)}
                            onCancel={() => handleCancel(request.numero)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
