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
            };
            Usuario.create.mockResolvedValue(usuario);
            const ejecucion = await crearUsuario(usuario);
            expect(ejecucion).toEqual(usuario);
        });
    });
    describe("Correo ya en uso",()=>{
        test("Deberia retornar mensaje de error", async ()=>{
            const usuario = {
                numeroIdentificacion: 100000000,
                nombreCompleto: "Diego",
                tipoIdentificacion: "CC",
                correo: "ejemplo@gmail.com",
                contrasena: "12345",
                tipo: "Cliente"
            };
            Usuario.findOne.mockResolvedValue(usuario);
            const resultado = crearUsuario(usuario);
            await expect(resultado).rejects.toThrow();
        });
    });

    describe("Identificacion inválida", () => {
        test("debe lanzar error si numeroIdentificacion no tiene entre 8 y 10 digitos", async () => {
            const usuarioInvalido = {
                numeroIdentificacion: 1234567, 
                nombreCompleto: "Diego",
                tipoIdentificacion: "CC",
                correo: "nuevo@mail.com",
                contrasena: "12345",
                tipo: "Cliente"
            };

            Usuario.findOne.mockResolvedValue(null);

            await expect(crearUsuario(usuarioInvalido))
                .rejects
                .toThrow("El numero de identificacion debe tener entre 8 y 10 digitos");
        });
    });
});

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
    describe("El usuario que intenta ingresar no se encuentra",()=>{
        test("Deberia retornar mensaje de error", async ()=>{
            const correo = "ejemplo@gmail.com";
            const contraseña = "12345";
            Usuario.findOne.mockResolvedValue(null);
            const resultado = validarInicioSesion(correo, contraseña);
            await expect(resultado).rejects.toThrow();
        })
    })
    describe("La contraseña es incorrecta",()=>{
        test("Deberia retornar mensaje de error", async ()=>{
            const correo = "ejemplo@gmail.com";
            const contraseña = "1234567";
            const usuario ={
                numeroIdentificacion: 100000000,
                nombreCompleto: "Diego",
                tipoIdentificacion: "CC",
                correo: "ejemplo@gmail.com",
                contrasena: "12345",
                tipo: "Cliente"
            }
            Usuario.findOne.mockResolvedValue(usuario);
            const resultado = validarInicioSesion(correo, contraseña);
            await expect(resultado).rejects.toThrow();
        })
    })
});