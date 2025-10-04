import { crearUsuario } from "../Services/UsuarioService.js"


const crearUsuarioController = async (req, res, next)=>{
    try{
        const usuarioCreado = await crearUsuario(req.body);
        res.status(201).json(usuarioCreado);
    }catch(err){
        next(err);
    }
}

export {crearUsuarioController};