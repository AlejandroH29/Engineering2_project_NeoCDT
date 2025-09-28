import { sequelize } from "../Config/configDatabase.js"
import { DataTypes } from "sequelize"

const solicitudCDT = sequelize.define("solicitudCDT",{
    numero:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    estado:{
        type: DataTypes.ENUM("Borrador", "enValidacion", "Aprobada", "Rechazada", "Cancelada"),
        allowNull: false
    },
    fechaInicio:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    numeroIdentificacionCliente:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroIdentificacionAgente:{
        type: DataTypes.STRING,
        allowNull: true
    },
})

export {solicitudCDT}