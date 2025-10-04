import { Usuario } from "../Models/UsuarioModel.js";

const crearUsuario = async (usuario) =>{
    const usuarioPorUserName = await Usuario.findOne({
        where: { nombreUsuario: usuario.nombreUsuario}
    })
    if(usuarioPorUserName != null){
        throw new Error("El nombre de usuario ya existe");
    }
    const nuevoUsuario = await Usuario.create(usuario);
    return nuevoUsuario;
}

export {crearUsuario};