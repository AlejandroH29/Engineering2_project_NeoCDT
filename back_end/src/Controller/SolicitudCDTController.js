import { crearSolicitudCDT } from "../Services/solicitudCDTService.js";

const crearSolicitudCDTController = async (req, res, next)=>{
    try{
        const solicitudCDTCreado = await crearSolicitudCDT(req.body);
        res.status(201).json(solicitudCDTCreado);
    }catch(err){
        next(err);
    }
}

const actualizarSolicitudCDTController = async (req, res, next)=>{
    try{
        const solicitudCDTCreado = await actualizarSolicitudCDT(req.body);
        res.status(201).json(solicitudCDTCreado);
    }catch(err){
        next(err);
    }
}

export {crearSolicitudCDTController, actualizarSolicitudCDTController}