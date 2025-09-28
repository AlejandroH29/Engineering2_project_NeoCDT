import {Agente} from "./Agente.js"
import {CDT} from "./CDTModel.js"
import {Cliente} from "./Cliente.js"
import {solicitudCDT} from "./solicitudCDTModel.js"

Cliente.hasMany(solicitudCDT,{
    foreignKey: "numeroIdentificacionCliente"
});
solicitudCDT.belongsTo(Cliente,{
    foreignKey: "numeroIdentificacionCliente",
    targetKey: "numeroIdentificacion"
})