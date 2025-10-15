import { useNavigate } from "react-router-dom";
import "../styles/form.css";

export const ViewClient = () => {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <nav>
                <h1 className="app-title">NeoCDT</h1>
            </nav>
            <div>
                <table cellSpacing="40">
                    <tbody>
                        <tr>
                            <td>
                                <div className="form">
                                    <h3>Solicitar CDT</h3>
                                    <button type="button" onClick={() => navigate('/create-cdt')}>Ingresar</button>
                                </div>
                            </td>
                            <td>
                                <div className="form">
                                    <h3>Gestionar tus CDT'S</h3>
                                    <button type="button" onClick={() => navigate('/my-requests')}>Ingresar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
