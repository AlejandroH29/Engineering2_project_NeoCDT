import {useEffect, useState} from 'react'
import { RequestCard } from '../components/RequestCard'

export const RequestsList = () => {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const listarSolicitudesPendientes = async () => {
            try{
                const pendientes = await axios.get("http://localhost:3000/listarSolicitudesCDTPendientes");
                setPendingRequests(pendientes.data);
            }catch (error){
                alert(error?.response?.data?.error);
            }
        }
        listarSolicitudesPendientes();
    }, [])

    return (
        <div>
            <h1>Solicitudes por revisar</h1>
            <div>
                {pendingRequests.length === 0 ? (
                    <h3>No hay solicitudes por resivar</h3>
                ) : (
                    myRequests.map((request) => (
                        <div key={request.numero} >
                            <RequestCard
                            plazo={request.tiempo}
                            monto={request.montoInicial}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
