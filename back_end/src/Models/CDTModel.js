import { sequelize } from "../Config/configDatabase.js";
import { DataTypes } from '@sequelize/core';

const CDT = sequelize.define("CDT",{
    numero:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    estado:{
        type: DataTypes.ENUM("Activo", "Inactivo"),
        allowNull: false
    },
    valor:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tasaInteres:{
        type: DataTypes.DOUBLE,
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
    numSolicitudCDT:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
})

export {CDT}