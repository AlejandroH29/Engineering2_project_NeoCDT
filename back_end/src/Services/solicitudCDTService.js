import { solicitudCDT } from "../Models/solicitudCDTModel.js";


function calculatInteresCDT(diasInversion){
    const tasaEfectiva = (1 + 0.10)**(diasInversion/365)-1;
    return tasaEfectiva;
}

function calcularGananciaCDT(montoInvertido, tasaEfectiva){
    const interes = (montoInvertido * tasaEfectiva);
    const ganancias = montoInvertido + interes;
    return ganancias;
}

function generarNumeroSolicitudAleatorio(){
    return Math.floor(100000 + Math.random() * 900000)
}

const crearSolicitudCDT = async (solicitud) =>{
    const numeroAleatorio = generarNumeroSolicitudAleatorio();
    solicitud.numeroSolicitud = numeroAleatorio;

    solicitud.estado = "Borrador";

    const solicitudPorNumero = await solicitudCDT.findOne({
        where: { numeroSolicitud: numeroAleatorio}
    })
    if(solicitudPorNumero != null){
        throw new Error("El numero de la solicitud ya existe")
    }
    const montoInicialSolicitud = await solicitudCDT.findOne({
        where: {montoInicial: solicitud.montoInicial}
    })
    if(montoInicialSolicitud <=0){
        throw new Error("El monto inicial debe ser mayor a 0")
    }

    const nuevaSolicitud = await solicitudCDT.create(solicitud);
    return nuevaSolicitud;
}

export {crearSolicitudCDT}
