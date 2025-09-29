import {Agente} from "./AgenteModel.js"
import {CDT} from "./CDTModel.js"
import {Cliente} from "./ClienteModel.js"
import {solicitudCDT} from "./solicitudCDTModel.js"

Cliente.hasMany(solicitudCDT,{
    foreignKey: "numCliente"
});
solicitudCDT.belongsTo(Cliente,{
    foreignKey: "numCliente",
    targetKey: "numeroIdentificacion"
})

Agente.hasMany(solicitudCDT,{
    foreignKey: "numAgente"
});
solicitudCDT.belongsTo(Agente,{
    foreignKey: "numAgente",
    targetKey: "numeroIdentificacion"
})

solicitudCDT.hasOne(CDT,{
    foreignKey: "numSolicitudCDT"
});
CDT.belongsTo(solicitudCDT, {
    foreignKey: "numSolicitudCDT",
    targetKey: "numero"
})