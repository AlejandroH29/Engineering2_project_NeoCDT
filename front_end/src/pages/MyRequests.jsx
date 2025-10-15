import {useContext, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { RequestCard } from '../components/RequestCard'

export const MyRequests = () => {
    const {currentUser} = useContext(AuthContext)
    const [myRequests, setMyRequests] = useState([]);

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
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
