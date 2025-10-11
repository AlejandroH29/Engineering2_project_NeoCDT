import { Usuario } from "../Models/UsuarioModel.js";
import { crearUsuario } from "../Services/UsuarioService.js";
import { validarInicioSesion } from "../Services/UsuarioService.js";

jest.mock("../Models/UsuarioModel.js", ()=>({
    Usuario:{
        findOne: jest.fn(),
        create: jest.fn()  
    }
}))

describe("Validacion de creacion de usuario", ()=>{
    describe("Comportamiento normal",()=>{
        test("deberia retornar el usuario", async ()=>{
            const usuario = {
                numeroIdentificacion: 100000000,
                nombreCompleto: "Diego",
                tipoIdentificacion: "CC",
                correo: "ejemplo@gmail.com",
                contrasena: "12345",
                tipo: "Cliente"
            }
            Usuario.create.mockResolvedValue(usuario);
            const ejecucion = await crearUsuario(usuario);
            expect(ejecucion).toEqual(usuario);
        })
    })
})

describe("Validacion inicio de sesion", ()=>{
    describe("Comportamiento normal", ()=>{
        test("Deberia retornoa el usuario", async ()=>{
            const usuario ={
                numeroIdentificacion: 100000000,
                nombreCompleto: "Diego",
                tipoIdentificacion: "CC",
                correo: "ejemplo@gmail.com",
                contrasena: "12345",
                tipo: "Cliente"
            }
            Usuario.findOne.mockResolvedValue(usuario);
            const resultado = await validarInicioSesion("ejemplo@gmail.com", "12345");
            expect(resultado).toEqual(usuario);
        })
    })
});