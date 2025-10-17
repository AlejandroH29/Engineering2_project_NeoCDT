import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { Usuario } from "../Models/UsuarioModel.js";
import { Op } from "sequelize";

     function calcularInteresCDT(diasInversion){
        // Si no hay tiempo o es 0, no hay interés
        if (!diasInversion || diasInversion <= 0) return 0;
        // Se asume una tasa nominal anual del 10% y se calcula la tasa efectiva
        // usando capitalización exponencial: (1 + i)^(periodos) - 1
        const tasaNominal = 0.10;
        const periodos = (diasInversion * 30) / 365;
        const tasaEfectiva = Math.pow(1 + tasaNominal, periodos) - 1;
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

    const crearSolicitudEnBorradorCDT = async (solicitud) =>{


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

        let montoInicial = solicitud.montoInicial;

        if (montoInicial === undefined || montoInicial === null || montoInicial === '') {
            montoInicial = 0;
        } else {
            montoInicial = Number(montoInicial);
            if (Number.isNaN(montoInicial)) montoInicial = 0;
        }
        solicitud.montoInicial = montoInicial;

          // Normalizar tiempo: si viene vacío => null (compatible con ENUM), si viene validar que sea "3","6","9" o "12"
        let tiempo = solicitud.tiempo;
        const valoresPermitidos = ["3","6","9","12"];
        if (tiempo === undefined || tiempo === null || String(tiempo).trim() === '') {
            tiempo = null;
        } else {
            const tiempoStr = String(tiempo).trim();
            if (!valoresPermitidos.includes(tiempoStr)) {
                // no es un valor válido del ENUM, lo tratamos como vacío
                tiempo = null;
            } else {
                // almacenar como string para coincidir con el ENUM en la DB
                tiempo = tiempoStr;
            }
        }
        solicitud.tiempo = tiempo;

        // calcular interés usando número de meses (0 si tiempo es null)
        const tasaEfectiva = calcularInteresCDT(tiempo ? Number(tiempo) : 0);
        const montoFinal = calcularGananciaCDT(solicitud.montoInicial, tasaEfectiva);
        solicitud.tasaInteres = tasaEfectiva;
        solicitud.montoGanancia = Math.trunc(montoFinal);

        const nuevaSolicitud = await solicitudCDT.create(solicitud);
        return nuevaSolicitud;
    }

const crearSolicitudEnValidacion = async (solicitud) => {
        // intentar encontrar por número si viene
        let solicitudBuscada = null;
        if (solicitud.numero) {
            solicitudBuscada = await solicitudCDT.findOne({
                where: { numero: solicitud.numero }
            });
        }

        // Si el body incluye el campo tiempo pero está vacío => rechazar
        if (Object.prototype.hasOwnProperty.call(solicitud, 'tiempo')) {
            if (solicitud.tiempo === null || String(solicitud.tiempo).trim() === '') {
                throw new Error("El tiempo es obligatorio y no puede estar vacío");
            }
        }

        // Si no existe la solicitud: crear nueva (monto > 0 requerido)
        if (!solicitudBuscada) {
            // validar montoInicial
            let montoInicial = solicitud.montoInicial;
            if (montoInicial === undefined || montoInicial === null || String(montoInicial).trim() === '') {
                throw new Error("El monto inicial debe ser un número mayor a cero");
            }
            montoInicial = Number(montoInicial);
            if (Number.isNaN(montoInicial) || montoInicial <= 0) {
                throw new Error("El monto inicial debe ser un número mayor a cero");
            }

            // normalizar tiempo (compatibilidad ENUM) y validar que no esté vacío
            let tiempo = solicitud.tiempo;
            const valoresPermitidos = ["3", "6", "9", "12"];
            if (tiempo === undefined || tiempo === null || String(tiempo).trim() === '') {
                // aquí se fuerza la validación: no permitir creación sin tiempo
                throw new Error("El tiempo es obligatorio y no puede estar vacío");
            } else {
                const tiempoStr = String(tiempo).trim();
                tiempo = valoresPermitidos.includes(tiempoStr) ? tiempoStr : null;
                if (tiempo === null) {
                    throw new Error("El tiempo es obligatorio y debe ser uno de los valores: 3, 6, 9 o 12");
                }
            }
            solicitud.tiempo = tiempo;

            // generar número único
            let numeroAleatorio;
            let existe = true;
            while (existe) {
                numeroAleatorio = generarNumeroSolicitudAleatorio();
                const solicitudPorNumero = await solicitudCDT.findOne({
                    where: { numero: numeroAleatorio }
                });
                existe = !!solicitudPorNumero;
            }
            solicitud.numero = numeroAleatorio;
            solicitud.estado = "enValidacion";
            solicitud.montoInicial = montoInicial;

            // calcular tasas/ganancia
            const tasaEfectiva = calcularInteresCDT(tiempo ? Number(tiempo) : 0);
            const montoFinal = calcularGananciaCDT(montoInicial, tasaEfectiva);
            solicitud.tasaInteres = tasaEfectiva;
            solicitud.montoGanancia = Math.trunc(montoFinal);

            const nuevaSolicitud = await solicitudCDT.create(solicitud);
            return nuevaSolicitud;
        }

        // Si existe: actualizar con los campos que envió el usuario (si los envió)
        // y validar que al final ambos campos (montoInicial > 0 y tiempo válido) estén presentes
        let montoExist = solicitudBuscada.montoInicial;
        let tiempoExist = solicitudBuscada.tiempo;

        // actualizar monto si viene
        if (!(solicitud.montoInicial === undefined || solicitud.montoInicial === null || String(solicitud.montoInicial).trim() === '')) {
            const montoNuevo = Number(solicitud.montoInicial);
            if (Number.isNaN(montoNuevo) || montoNuevo <= 0) {
                throw new Error("El monto inicial debe ser un número mayor a cero");
            }
            solicitudBuscada.montoInicial = montoNuevo;
            montoExist = montoNuevo;
        }

        // actualizar tiempo si viene (aquí payload vacío ya fue rechazado arriba)
        if (!(solicitud.tiempo === undefined || solicitud.tiempo === null || String(solicitud.tiempo).trim() === '')) {
            const valoresPermitidos = ["3", "6", "9", "12"];
            const tiempoStr = String(solicitud.tiempo).trim();
            if (!valoresPermitidos.includes(tiempoStr)) {
                throw new Error("El tiempo debe ser uno de los valores permitidos: 3, 6, 9 o 12");
            }
            solicitudBuscada.tiempo = tiempoStr;
            tiempoExist = tiempoStr;
        }

        // validar que ambos campos estén completos antes de pasar a enValidacion
        if (montoExist === undefined || montoExist === null || Number(montoExist) <= 0 ||
            tiempoExist === undefined || tiempoExist === null || String(tiempoExist).trim() === '') {
            throw new Error("Para enviar a validación ambos campos montoInicial (>0) y tiempo (3,6,9,12) deben estar completos");
        }

        // recalcular tasa y ganancia, actualizar estado y guardar
        const tasaEfectiva = calcularInteresCDT(Number(tiempoExist));
        const montoFinal = calcularGananciaCDT(Number(montoExist), tasaEfectiva);
        solicitudBuscada.tasaInteres = tasaEfectiva;
        solicitudBuscada.montoGanancia = Math.trunc(montoFinal);
        solicitudBuscada.estado = "enValidacion";
        await solicitudBuscada.save();

        return solicitudBuscada;
    }

    const estadosPermitidos = ["Aprobada", "Rechazada"];

    const actualizarSolicitudCDT = async (solicitud, nuevoEstado) => {
        const solicitudBuscada = await solicitudCDT.findOne({
            where: {numero: solicitud.numero}
        });

        if (!solicitudBuscada) {
            throw new Error("Solicitud no encontrada");
        }

        if (solicitudBuscada.estado !== "enValidacion"){
            throw new Error("La solicitud solo se puede actualizar si está en estado en validacion");
        }

        if (!estadosPermitidos.includes(nuevoEstado)){
            throw new Error ("Solo se puede actualizar a los estados: Aprobada o Rechazada");
        }

        solicitudBuscada.estado = nuevoEstado;
        await solicitudBuscada.save();
        return {mensaje: "La solicitud a sido actualizada al estado " + nuevoEstado + "."}
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
        throw new Error ("La solicitud no se puede cancelar");
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

  const listarSolicitudesCDTEstado = async (numUsuario) => {

    const solicitudesPorUsuarioEstado = await solicitudCDT.findAll({
        where: {
            numUsuario: numUsuario,
            estado: { [Op.in]: ["Borrador", "enValidacion"] }
        }
    });

    if (!solicitudesPorUsuarioEstado || solicitudesPorUsuarioEstado.length === 0){
        throw new Error("No se encontraron ningunas solicitudes pendientes");
    }
    return solicitudesPorUsuarioEstado;
  }

export {crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT, eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudesCDTEstado}