import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'

export const RequestCard = ({estado, monto, plazo, onDelete, onEdit, onApprove, onDecile, onCancel}) => {
    const {currentUser} = useContext(AuthContext)

    return (
        <div className="request-card" >
            <p>{monto}</p>
            <p>{plazo}</p>
            {currentUser.tipo === "Cliente" ? (
                <>
                    <p>{estado}</p>
                    {estado === ("Borrador" || "enValidacion") && (
                        <div>
                            <button onClick={onEdit}>Editar</button>
                            <button onClick={onDelete}>Eliminar</button>
                            <button onClick={onCancel}>Cancelar</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Solicitud de: {solicitante}</p>
                    <button onClick={onApprove} >Aprobar</button>
                    <button onClick={onDecile} >Rechazar</button>
                </>
            )
            }            
        </div>
    )
}
