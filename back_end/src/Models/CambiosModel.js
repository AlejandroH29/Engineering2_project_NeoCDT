import { sequelize } from "../Config/configDatabase.js";
import { DataTypes } from "sequelize";

const Cambios  = sequelize.define("Cambios",{
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaCambio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numSolicitudCDT:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export {Cambios};