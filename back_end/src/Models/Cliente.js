import { sequelize } from "../Config/configDatabase";
import {DataTypes} from "sequelize";

const Cliente = sequelize.define("Cliente", {
    numeroIdentificacion:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    nombreCompleto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoIdentificacion:{
        type: DataTypes.ENUM("CC", "CE", "Pasaporte"),
        allowNull: false
    },
    nombreUsuario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

export {Cliente}