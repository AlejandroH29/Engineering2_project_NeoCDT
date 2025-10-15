
export const RequestCard = ({estado, monto, plazo, onDelete, onEdit}) => {
    return (
        <div className="request-card" >
            <p>{estado}</p>
            <p>{monto}</p>
            <p>{plazo}</p>
            {estado !== "Aprobada" && (
                <div>
                    <button onClick={onEdit}>Editar</button>
                    <button onClick={onDelete}>Eliminar</button>
                </div>
                )}
        </div>
    )
}
