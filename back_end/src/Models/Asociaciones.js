import { Usuario } from "./UsuarioModel.js"
import { Cambios } from "./CambiosModel.js";
import { solicitudCDT } from "./solicitudCDTModel.js";

Usuario.hasMany(solicitudCDT,{
    foreignKey: "numUsuario"
});
solicitudCDT.belongsTo(Usuario,{
    foreignKey: "numUsuario",
    targetKey: "numeroIdentificacion"
})

solicitudCDT.hasMany(Cambios, {
    foreignKey: "numSolicitudCDT"
})

Cambios.belongsTo(solicitudCDT, {
    foreignKey: "numSolicitudCDT",
    targetKey: "numero"
})
