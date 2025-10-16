import {useContext, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { RequestCard } from '../components/RequestCard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const MyRequests = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext)
    const [myRequests, setMyRequests] = useState([]);

    const handleEdit = () => {
        navigate("/request-form");
    }

    const handleDelete = async () => {
        try{
            await axios.delete(`http://localhost:3000/eliminarSolicitudCDT/${request.numero}`)
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
                            onEdit={handleEdit}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
