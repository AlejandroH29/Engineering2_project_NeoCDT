import { FormButton } from "./FormButton";
import "../styles/popup.css"

export const Popup = ({ text, onSuccess, onClose, successText, closeText }) => {
    return (
    <div className="popup-overlay">
        <div className="popup-content">
            <h2>Aviso</h2>
            <p>{text}</p>
            {onSuccess && (
                <FormButton onClick={onSuccess} text={successText}/>
            )}
            {onClose && (
                <FormButton onClick={onClose} text={closeText}/>
            )}
        </div>
    </div>
    );
};