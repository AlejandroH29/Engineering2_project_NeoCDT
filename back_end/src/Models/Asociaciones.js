import { Usuario } from "./UsuarioModel.js"
import { solicitudCDT } from "./solicitudCDTModel.js";

Usuario.hasMany(solicitudCDT,{
    foreignKey: "numUsuario"
});
solicitudCDT.belongsTo(Usuario,{
    foreignKey: "numUsuario",
    targetKey: "numeroIdentificacion"
})
