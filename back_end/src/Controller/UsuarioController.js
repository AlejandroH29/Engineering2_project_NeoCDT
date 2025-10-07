import { crearUsuario } from "../Services/UsuarioService.js"
import { validarInicioSesion } from "../Services/UsuarioService.js";

const crearUsuarioController = async (req, res, next)=>{
    try{
        const usuarioCreado = await crearUsuario(req.body);
        res.status(201).json(usuarioCreado);
    }catch(err){
        next(err);
        console.log(err);
    }
}

const validarInicioSesionController = async (req, res, next) =>{
    try{
        const validacion = await validarInicioSesion(req.body.correo, req.body.contrasena);
        res.status(201).json(validacion);
    }catch(err){
        next(err);
        console.log(err)
    }
}
export {crearUsuarioController, validarInicioSesionController};