import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { Usuario } from "../Models/UsuarioModel.js";


function calcularInteresCDT(diasInversion){
    const tasaEfectiva = (1 + 0.10)**(((diasInversion)*30)/365)-1;
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

    const usuarioBuscado = await Usuario.findOne({
        where: {numeroIdentificacion: solicitud.numUsuario}
    });
    if(!usuarioBuscado){
        throw new Error("Usuario no encontrado")
    }

    if (usuarioBuscado.tipo !== "Cliente") {
        throw new Error("Solo los usuarios de tipo Cliente pueden crear solicitudes");
    }

    const tiempo = parseInt(solicitud.tiempo)
    const tasaEfectiva = calcularInteresCDT(tiempo);
    const montoFinal = calcularGananciaCDT(solicitud.montoInicial, tasaEfectiva);
    

    solicitud.tasaInteres = tasaEfectiva;
    solicitud.montoGanancia = montoFinal;

    const nuevaSolicitud = await solicitudCDT.create(solicitud);
    return nuevaSolicitud;
}

const actualizarSolicitudCDT = async (solicitud, nuevoEstado,) =>{

    const solicitudBuscada = await solicitudCDT.findOne({
        where: {numero: solicitud.numero}
    });
    if (!solicitudBuscada) {
        throw new Error("Solicitud no encontrada");
    }
    
<<<<<<< HEAD
=======
    const usuario = await Usuario.findOne({
        where: {numeroIdentificacion: solicitudBuscada.numUsuario}
    });

    if (usuario.tipo == "Agente") {
        if (!estadosPermitidosPorAgente.includes(nuevoEstado)) {
            throw new Error("El estado al que vas a modificar la solicitud no es valido");
        }
    } else if (usuario.tipo == "Cliente") {
        if (nuevoEstado !== estadoPermitidoPorCliente) {
            throw new Error("El estado al que vas a modificar la solicitud no es valido para Cliente");
        }
    } else {
         throw new Error("Tipo de usuario no autorizado para actualizar el estado de la solicitud");
    }

>>>>>>> fbb1c76dcb672a934e5bc25aadb871650b292855
    solicitudBuscada.estado = nuevoEstado;
    await solicitudBuscada.save();

    return solicitudBuscada;
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

export {crearSolicitudCDT, actualizarSolicitudCDT, eliminarSolicitudCDT}
