import { Usuario } from "../Models/UsuarioModel.js";

const crearUsuario = async (usuario) =>{
    const usuarioPorEmail = await Usuario.findOne({
        where: { correo: usuario.correo}
    })
    if(usuarioPorEmail != null){
        throw new Error("El correo de usuario ya esta en uso");
    }
    const nuevoUsuario = await Usuario.create(usuario);
    return nuevoUsuario;
}

const validarInicioSesion = async (correo, contraseña) =>{
    const usuarioPorCorreo = await Usuario.findOne({
        where: { correo: correo}
    })
    if(usuarioPorCorreo == null){
        throw new Error("El usuario no se encontro o no existe");
    }else{
        if(usuarioPorCorreo.contrasena !== contraseña){
            throw new Error("Contraseña incorrecta");
        }
    }
    return usuarioPorCorreo; 
}

export {crearUsuario, validarInicioSesion};