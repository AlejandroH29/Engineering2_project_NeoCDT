import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/table.css'

export const RequestCard = ({
    estado, 
    monto, 
    plazo, 
    interes, 
    ganancia, 
    numero, 
    onDelete, 
    onEdit, 
    onCancel
}) => {
    const {currentUser} = useContext(AuthContext)

    const getStatusClass = (estado) => {
        switch(estado) {
            case 'enValidacion':
                return 'validation';
            case 'Aprobada':
                return 'approved';
            case 'Rechazada':
                return 'rejected';
            case 'Cancelada':
                return 'cancelled';
            default:
                return '';
        }
    };

    return (
        <div className="request-card">
            <div className="request-card-header">
                <span className="request-number">N° {numero}</span>
                <span className={`request-status ${getStatusClass(estado)}`}>
                    {estado}
                </span>
            </div>
            
            <div className="request-details">
                <p className="request-detail-item">
                    <span className="request-detail-label">Monto Inicial:</span> {monto}
                </p>
                <p className="request-detail-item">
                    <span className="request-detail-label">Interés:</span> {interes}%
                </p>
                <p className="request-detail-item">
                    <span className="request-detail-label">Plazo:</span> {plazo} meses
                </p>
                <p className="request-detail-item">
                    <span className="request-detail-label">Ganancia:</span> {ganancia}
                </p>
            </div>

            {estado === 'enValidacion' && (
                <div className="request-actions">
                    <button onClick={onEdit} className="request-button edit">
                        Editar
                    </button>
                    <button onClick={onCancel} className="request-button cancel">
                        Cancelar
                    </button>
                </div>
            )}
            
            {estado === 'Cancelada' && (
                <div className="request-actions">
                    <button onClick={onDelete} className="request-button delete">
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    )
}
