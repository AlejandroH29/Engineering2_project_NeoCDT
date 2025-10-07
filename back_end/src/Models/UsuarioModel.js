import { sequelize } from "../Config/configDatabase.js";
import {DataTypes} from "sequelize";

const Usuario = sequelize.define("Usuario", {
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
    },
    contraseña:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo:{
        type: DataTypes.ENUM("Cliente", "Agente", "Administrador"),
        allowNull: false
    }
})

export {Usuario}