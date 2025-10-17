import { crearSolicitudCDT, actualizarSolicitudCDT, cancelarSolicitudCDT ,eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudesCDTEstado } from "../Services/solicitudCDTService.js";

const crearSolicitudCDTController = async (req, res, next)=>{
    try{
        const solicitudCDTCreado = await crearSolicitudCDT(req.body);
        res.status(201).json(solicitudCDTCreado);
    }catch(err){
        next(err);
    }
}

const actualizarSolicitudCDTController = async (req, res, next) => {
    try {
        const { numero, estado: nuevoEstado } = req.body;

        const solicitudCDTActualizada = await actualizarSolicitudCDT({ numero }, nuevoEstado);

        res.status(200).json(solicitudCDTActualizada);
    } catch (err) {
        next(err);
    }
};

const cancelarSolicitudCDTController = async (req, res, next) => {
    try {
        const solicitud = req.params.numero;
        const solicitudCDTCancelada = await cancelarSolicitudCDT(solicitud);
        res.status(200).json(solicitudCDTCancelada);
    } catch (err){
        next(err)
    }

};

const eliminarSolicitudCDTController = async (req, res, next) => {
    try{
        const numero = req.params.numero;
        const solicitudCDTEliminada = await eliminarSolicitudCDT({numero});
        res.status(200).json(solicitudCDTEliminada);
    }catch(err){
        next(err)
    }
};

const listarSolicitudesCDTUsuarioController = async (req, res, next) => {
    try{
        const numUsuario = req.params.numUsuario;
        const listadoSolicitudesUsuario = await listarSolicitudesCDTUsuario(numUsuario);
        res.status(200).json(listadoSolicitudesUsuario);
    }catch(err){
        next(err)
    }
}

const listarSolicitudesCDTEstadoController = async (req, res, next) => {
    try{
        const listadoSolicitudesEstado = await listarSolicitudesCDTEstado();
        res.status(200).json(listadoSolicitudesEstado);
    }catch(err){
        next(err)
    }
}

export {crearSolicitudCDTController, actualizarSolicitudCDTController, cancelarSolicitudCDTController, eliminarSolicitudCDTController, listarSolicitudesCDTUsuarioController, listarSolicitudesCDTEstadoController}