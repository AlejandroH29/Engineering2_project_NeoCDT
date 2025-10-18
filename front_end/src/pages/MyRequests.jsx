import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { RequestCard } from '../components/RequestCard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const MyRequests = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext)
    const [myRequests, setMyRequests] = useState([]);

    useEffect(() => {
        const listarSolicitudesPropias = async () => {
            try{
                const propios = await axios.get(`http://localhost:3000/listarSolicitudesUsuario/${currentUser.numero}`);
                setMyRequests(propios.data);
            }catch (error){
                alert(error?.response?.data?.error);
            }
        }
        listarSolicitudesPropias();
    }, [])

    const handleEdit = () => {
        navigate("/request-form");
    }

    const handleCancel = async (requestNumber) => {
        try{
            await axios.put(`http://localhost:3000/cancelarSolicitudCDT/${requestNumber}`)
        }
        catch (error){
            alert(error?.response?.data?.error)
        }
    }

    const handleDelete = async (requestNumber) => {
        try{
            await axios.delete(`http://localhost:3000/eliminarSolicitudCDT/${requestNumber}`)
        }catch (error){
            alert(error?.response?.data?.error)
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
