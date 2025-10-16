import { crearSolicitudCDT, actualizarSolicitudCDT, eliminarSolicitudCDT } from "../Services/solicitudCDTService.js";

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

const eliminarSolicitudCDTController = async (req, res, next) => {
    try{
        const numero = req.params.numero;
        const solicitudCDTEliminada = await eliminarSolicitudCDT({numero});
        res.status(200).json(solicitudCDTEliminada);
    }catch(err){
        next(err)
    }
};

export {crearSolicitudCDTController, actualizarSolicitudCDTController, eliminarSolicitudCDTController}