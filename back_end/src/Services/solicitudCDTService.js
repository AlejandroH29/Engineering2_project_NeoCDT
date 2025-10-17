import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { Usuario } from "../Models/UsuarioModel.js";
import { Op } from "sequelize";

    function calcularInteresCDT(diasInversion){
        const tasaEfectiva = (1 + 0.10)(((diasInversion)*30)/365)-1;
        return tasaEfectiva;
    }

    function calcularGananciaCDT(montoInvertido, tasaEfectiva){
        const interes = (montoInvertido * tasaEfectiva);
        const montoFinal = montoInvertido + interes;
        return montoFinal;
    }

    function generarNumeroSolicitudAleatorio(){
        return Math.floor(100000 + Math.random() * 900000)
    }

    const crearSolicitudCDT = async (solicitud) =>{

        if (!solicitud.montoInicial || solicitud.montoInicial <= 0) {
            throw new Error("El monto inicial debe ser mayor a 0");
        }

        let numeroAleatorio;
        let existe = true;  
        while (existe) {
            numeroAleatorio = generarNumeroSolicitudAleatorio();
            const solicitudPorNumero = await solicitudCDT.findOne({
                where: {numero: numeroAleatorio}
            })
            existe = !!solicitudPorNumero;
        }
        solicitud.numero = numeroAleatorio;

        solicitud.estado = "Borrador";

        const tiempo = parseInt(solicitud.tiempo)
        const tasaEfectiva = calcularInteresCDT(tiempo);
        const montoFinal = calcularGananciaCDT(solicitud.montoInicial, tasaEfectiva);

        solicitud.tasaInteres = tasaEfectiva;
        solicitud.montoGanancia = montoFinal;

        const nuevaSolicitud = await solicitudCDT.create(solicitud);
        return nuevaSolicitud;
    }

    const actualizarSolicitudCDT = async (solicitud, nuevoEstado) => {
        const solicitudBuscada = await solicitudCDT.findOne({
            where: {numero: solicitud.numero}
        });

        if (!solicitudBuscada) {
            throw new Error("Solicitud no encontrada");
        }
        
        solicitudBuscada.estado = nuevoEstado;
        await solicitudBuscada.save();

        return solicitudBuscada;
    }

  const cancelarSolicitudCDT = async (solicitud) => {
    const solicitudBuscada = await solicitudCDT.findOne({
        where: {numero: solicitud.numero}
    });

    if (!solicitudBuscada){
        throw new Error("Solicitud no encontrada");
    }

    if (solicitudBuscada.estado === "Borrador" || solicitudBuscada.estado === "enValidacion"){
        solicitudBuscada.estado = "Cancelada";
        await solicitudBuscada.save();
        return { mensaje: "La solicitud ha sido cancelada con éxito" }; 
    } else {
        throw new Error ("La solicitud no se puede cancelar porque");
    }
  }

  const eliminarSolicitudCDT = async (solicitud) => {

    const solicitudBuscada = await solicitudCDT.findOne({
        where: {numero: solicitud.numero}
    });

    if (!solicitudBuscada){
        throw new Error ("Solicitud no encontrada");
    }

    await solicitudBuscada.destroy();
    return {mensaje: "La solicitud ha sido eliminada con éxito"}

  }

  const listarSolicitudesCDTUsuario = async (numUsuario) => {
        
    const solicitudesPorUsuario = await solicitudCDT.findAll({
        where: {numUsuario: numUsuario}
    });

    if (!solicitudesPorUsuario || solicitudesPorUsuario.length === 0){
        throw new Error("No se encontraron solicitudes");
    }

    return solicitudesPorUsuario;
  }

  const listarSolicitudesCDTEstado = async () => {

    const solicitudesPorEstado = await solicitudCDT.findAll({
        where: {
            estado: { [Op.in]: ["Borrador", "enValidacion"] }
        }
    });

    if (!solicitudesPorEstado || solicitudesPorEstado.length === 0){
        throw new Error("No se encontraron ningunas solicitudes pendientes");
    }

    return solicitudesPorEstado;

  }

export {crearSolicitudCDT, actualizarSolicitudCDT, cancelarSolicitudCDT, eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudesCDTEstado}