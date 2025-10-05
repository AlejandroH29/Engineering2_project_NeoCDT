import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";

export const ViewAgent = () => {
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
                                    <h3>Gestionar CDT'S</h3>
                                    <button type="button" onClick={() => navigate('/')}>Ingresar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
