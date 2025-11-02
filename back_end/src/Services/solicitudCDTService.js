import { solicitudCDT } from "../Models/solicitudCDTModel.js";
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

const crearSolicitudEnBorradorCDT = async (solicitud) => {
  const normMonto = m => {
    if (m === undefined || m === null || m === '') return 0;
    const n = Number(m); return Number.isNaN(n) ? 0 : n;
  };
  const normTiempo = t => {
    if (t === undefined || t === null || String(t).trim() === '') return null;
    const s = String(t).trim(); return ['3','6','9','12'].includes(s) ? s : null;
  };

  const numero = (solicitud.numero && String(solicitud.numero).trim() !== '') ? Number(solicitud.numero) : null;
  const numUsuario = (solicitud.numUsuario && String(solicitud.numUsuario).trim() !== '') ? Number(solicitud.numUsuario) : null;

  // Si se envía numero -> actualizar esa solicitud (si existe)
  if (numero) {
    const existente = await solicitudCDT.findOne({ where: { numero } });

    const tieneMonto = Object.prototype.hasOwnProperty.call(solicitud, 'montoInicial');
    const tieneTiempo = Object.prototype.hasOwnProperty.call(solicitud, 'tiempo');

    const montoInicial = tieneMonto ? normMonto(solicitud.montoInicial) : existente.montoInicial;
    const tiempo = tieneTiempo ? normTiempo(solicitud.tiempo) : existente.tiempo;

    const tasa = calcularInteresCDT(tiempo ? Number(tiempo) : 0);
    const montoGanancia = Math.trunc(calcularGananciaCDT(montoInicial, tasa));

    const toUpdate = { montoInicial, tiempo, tasaInteres: tasa, montoGanancia };
    if (numUsuario) toUpdate.numUsuario = numUsuario;

    await existente.update(toUpdate);
    return await existente.reload();
  }

  // Si no se envía numero -> crear nueva solicitud
  let numeroAleatorio;
  do {
    numeroAleatorio = generarNumeroSolicitudAleatorio();
  } while (await solicitudCDT.findOne({ where: { numero: numeroAleatorio } }));

  const montoInicial = normMonto(solicitud.montoInicial);
  const tiempo = normTiempo(solicitud.tiempo);
  const tasa = calcularInteresCDT(tiempo ? Number(tiempo) : 0);
  const montoGanancia = Math.trunc(calcularGananciaCDT(montoInicial, tasa));

  const nueva = {
    ...solicitud,
    numero: numeroAleatorio,
    estado: 'Borrador',
    numUsuario: numUsuario ?? solicitud.numUsuario,
    montoInicial,
    tiempo,
    tasaInteres: tasa,
    montoGanancia
  };

  return await solicitudCDT.create(nueva);
};


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

  const listarSolicitudesCDTBorrador = async (numUsuario) => {

    const listarSolicitudesCDTBorrador = await solicitudCDT.findAll({
        where: {
            numUsuario: numUsuario,
            estado: "Borrador"
        }
    });

    if (!listarSolicitudesCDTBorrador || listarSolicitudesCDTBorrador.length === 0){
        throw new Error("No se encontraron ningunas solicitudes en borrador");
    }
    return listarSolicitudesCDTBorrador;
  }

    const listarSolicitudCDTBorrador = async (numero) => {

    const listarSolicitudCDTBorrador = await solicitudCDT.findOne({
        where: {
            numero: numero,
            estado: "Borrador"
        }
    });

    if (!listarSolicitudCDTBorrador || listarSolicitudCDTBorrador.length === 0){
        throw new Error("No se encontró ninguna solicitud");
    }
    return listarSolicitudCDTBorrador;
  }

    const listarSolicitudesEnValidacion = async (numUsuario) => {

    const listarSolicitudesEnValidacion = await solicitudCDT.findAll({
        where: {
            numUsuario: numUsuario,
            estado: "enValidacion"
        }
    });

    if (!listarSolicitudesEnValidacion || listarSolicitudesEnValidacion.length === 0){
        throw new Error("No se encontraron ningunas solicitudes pendientes");
    }
    return listarSolicitudesEnValidacion;
  }

    const listarSolicitudesCDTPendientesAgente = async () => {

    const listarSolicitudesCDTPendientesAgente = await solicitudCDT.findAll({
        where: {
            estado: { [Op.in]: ["enValidacion"] }
        }
    });

    if (!listarSolicitudesCDTPendientesAgente || listarSolicitudesCDTPendientesAgente.length === 0){
        throw new Error("No se encontraron ningunas solicitudes pendientes");
    }
    return listarSolicitudesCDTPendientesAgente;
  }

export {crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT, eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudesCDTBorrador, listarSolicitudCDTBorrador, listarSolicitudesEnValidacion, listarSolicitudesCDTPendientesAgente}