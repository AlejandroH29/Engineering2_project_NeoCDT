import { crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT ,eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudesCDTBorrador, listarSolicitudesEnValidacion, listarSolicitudesCDTPendientesAgente } from "../Services/solicitudCDTService.js";

const crearSolicitudEnBorradorCDTController = async (req, res, next) => {
    try {
        const solicitud = { ...req.body };

       
        const usuarioId = req.user?.id || req.user?.numUsuario || req.usuario?.id || req.usuario?.numUsuario
                          || (typeof req.body.numUsuario === "string" && req.body.numUsuario.trim() !== "" ? req.body.numUsuario.trim() : null);

        if (!usuarioId) {
            return res.status(401).json({ error: "Usuario no autenticado o numUsuario no proporcionado" });
        }
        solicitud.numUsuario = usuarioId;

        if (!solicitud.numero) delete solicitud.numero;
        if (!solicitud.estado) delete solicitud.estado;

const nueva = await crearSolicitudEnBorradorCDT(solicitud);

        const respuesta = nueva.get ? nueva.get({ plain: true }) : { ...nueva };
        const tasaDecimal = Number(respuesta.tasaInteres) || 0;

        respuesta.tasaInteres = `${(tasaDecimal * 100).toFixed(2)}%`;
       
        return res.status(201).json(respuesta);
    } catch (error) {
        return next(error);
    }
};

const crearSolicitudEnValidacionController = async (req, res, next) => {
    try {
        const payload = { ...req.body };

        // Obtener identificador del usuario (middleware de auth o body)
        const usuarioId = req.user?.id || req.user?.numUsuario || req.usuario?.id || req.usuario?.numUsuario
                          || (typeof req.body.numUsuario === "string" && req.body.numUsuario.trim() !== "" ? req.body.numUsuario.trim() : null);

        if (!usuarioId) {
            return res.status(401).json({ error: "Usuario no autenticado o numUsuario no proporcionado" });
        }
        payload.numUsuario = usuarioId;

        // No permitir que el cliente fije el estado; si no viene número, eliminarlo para que el servicio lo genere
        if (!payload.numero) delete payload.numero;
        if (payload.estado) delete payload.estado;

        const resultado = await crearSolicitudEnValidacion(payload);

        // Normalizar salida (Sequelize instance -> plain object)
        const respuesta = resultado?.get ? resultado.get({ plain: true }) : { ...resultado };

        // Formatear tasa como porcentaje legible
        const tasaDecimal = Number(respuesta.tasaInteres) || 0;
        respuesta.tasaInteres = `${(tasaDecimal * 100).toFixed(2)}%`;

        // Código HTTP: 201 si se creó nueva (no se envió número), 200 si se actualizó un borrador (se envió número)
        const statusCode = req.body.numero ? 200 : 201;

        return res.status(statusCode).json(respuesta);
    } catch (err) {
        return next(err);
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
        const numero = req.params.numero;
        const solicitudCDTCancelada = await cancelarSolicitudCDT({numero});
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

const listarSolicitudesCDTBorradorController = async (req, res, next) => {
    try{
        const numUsuario = req.params.numUsuario;
        const listadoSolicitudesBorrador = await listarSolicitudesCDTBorrador(numUsuario);
        res.status(200).json(listadoSolicitudesBorrador);
    }catch(err){
        next(err)
    }
}

const listarSolicitudesEnValidacionController = async (req, res, next) => {
    try{
        const numUsuario = req.params.numUsuario;
        const listadoSolicitudesEnValidacion = await listarSolicitudesEnValidacion(numUsuario);
        res.status(200).json(listadoSolicitudesEnValidacion);
    }catch(err){
        next(err)
    }
}

const listarSolicitudesCDTPendientesAgenteController = async (req, res, next) => {
    try{
        const listadoSolicitudesPendientes = await listarSolicitudesCDTPendientesAgente();
        res.status(200).json(listadoSolicitudesPendientes);
    }catch(err){
        next(err)
    }
};

export {crearSolicitudEnBorradorCDTController, crearSolicitudEnValidacionController, actualizarSolicitudCDTController, 
        cancelarSolicitudCDTController, eliminarSolicitudCDTController, listarSolicitudesCDTUsuarioController, 
        listarSolicitudesCDTBorradorController, listarSolicitudesEnValidacionController, listarSolicitudesCDTPendientesAgenteController}