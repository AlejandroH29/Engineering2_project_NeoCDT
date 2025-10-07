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