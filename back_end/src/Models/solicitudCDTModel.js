import { sequelize } from "../Config/configDatabase.js"
import { DataTypes } from "sequelize"

const solicitudCDT = sequelize.define("solicitudCDT",{
    numero:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    numUsuario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.ENUM("Borrador", "enValidacion", "Aprobada", "Rechazada", "Cancelada"),
        allowNull: false
    },
    tiempo:{
        type: DataTypes.ENUM("3","6","9","12"),
        allowNull: true
    },
    tasaInteres:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    montoInicial:{
        type: DataTypes.INTEGER,
        allowNull:true
    },
    montoGanancia:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{ 
    tableName: "SolicitudCDT",     
    freezeTableName: true,
    timestamps: false   
})

export {solicitudCDT}