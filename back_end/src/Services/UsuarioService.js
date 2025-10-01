import { Cliente } from "../Models/ClienteModel";

const crearCliente = async (cliente) =>{
    try{
        const clientePorUserName = await Cliente.findOne({
            where: { nombreUsuario: cliente.nombreUsuario}
        })
        if(clientePorUserName != null){
            throw new Error("El nombre de usuario ya existe");
        }
        const nuevoCliente = await Cliente.create(cliente);
        return nuevoCliente;
    }catch(e){
        return "Error al crear el usuario, verifique sus datos"
    }
}