import { crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT ,eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudCDTBorrador, listarSolicitudesCDTPendientesAgente } from "../Services/solicitudCDTService.js";

const crearSolicitudEnBorradorCDTController = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        
        const solicitudCreada = await crearSolicitudEnBorradorCDT(payload);
        
        res.status(201).json(solicitudCreada);
    } catch (err) {
        next(err);
    }
};

const crearSolicitudEnValidacionController = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    const usuarioId = req.user?.id || req.user?.numUsuario || req.usuario?.id || req.usuario?.numUsuario
                      || (typeof req.body.numUsuario === "string" && req.body.numUsuario.trim() !== "" ? req.body.numUsuario.trim() : null);

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no autenticado o numUsuario no proporcionado" });
    }
    payload.numUsuario = usuarioId;

    if (!payload.numero) delete payload.numero;
    if (payload.estado) delete payload.estado;

    const resultado = await crearSolicitudEnValidacion(payload);

    const respuesta = resultado?.get ? resultado.get({ plain: true }) : { ...resultado };

    const tasaDecimal = Number(respuesta.tasaInteres) || 0;
    respuesta.tasaInteres = `${(tasaDecimal * 100).toFixed(2)}%`;

    const statusCode = req.body.numero ? 200 : 201;

    return res.status(statusCode).json(respuesta);
  } catch (err) {
    // Si el error es de validación devolvemos 400 con el mensaje
    const mensaje = err && err.message ? err.message : 'Error interno';
    const esValidacion = err && (err.status === 400
                          || /monto inicial/i.test(mensaje)
                          || /tiempo/i.test(mensaje)
                          || /obligatorio/i.test(mensaje)
                          || /debe ser un número/i.test(mensaje));

    if (esValidacion) {
      return res.status(400).json({ error: mensaje });
    }

    // Otros: pasar al middleware (500)
    return next(err);
  }
};

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

const listarSolicitudCDTBorradorController = async (req, res, next) => {
    try{
        const numero = req.params.numero;
        const SolicitudCDTBorrador = await listarSolicitudCDTBorrador(numero);
        res.status(200).json(SolicitudCDTBorrador);
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
        listarSolicitudCDTBorradorController, listarSolicitudesCDTPendientesAgenteController}