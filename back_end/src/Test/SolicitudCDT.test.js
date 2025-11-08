import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT, eliminarSolicitudCDT, listarSolicitudesCDTUsuario, listarSolicitudCDTBorrador, listarSolicitudesCDTPendientesAgente } from "../Services/solicitudCDTService.js";

jest.mock("../Models/solicitudCDTModel.js", () => ({
    solicitudCDT: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn()
    }
}));

describe("SolicitudCDTService - crearSolicitudEnBorradorCDT", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it("debe crear un borrador válido cuando se envían montoInicial y tiempo", async function () {
        solicitudCDT.findOne.mockResolvedValue(null);
        solicitudCDT.create.mockImplementation(async (payload) => ({ ...payload }));

        const payload = {
            numUsuario: "1234",
            montoInicial: "120000",
            tiempo: "9"
        };

        const result = await crearSolicitudEnBorradorCDT(payload);

        expect(solicitudCDT.findOne).toHaveBeenCalled();
        expect(solicitudCDT.create).toHaveBeenCalled();

        expect(result).toHaveProperty("numero");
        expect(result.estado).toBe("Borrador");
        expect(typeof result.montoInicial).toBe("number");
        expect(result.montoInicial).toBe(120000);
        expect(result.tiempo).toBe("9");
        expect(typeof result.tasaInteres).toBe("number");
        expect(typeof result.montoGanancia).toBe("number");
    });

    it("debe actualizar una solicitud existente cuando se envía numero (ruta de actualización en crearSolicitudEnBorradorCDT)", async () => {
        // preparar mock de la solicitud existente con métodos update y reload
        const existing = {
            numero: 999999,
            numUsuario: 1234,
            montoInicial: 50000,
            tiempo: "3",
            tasaInteres: 0,
            montoGanancia: 0,
            update: jest.fn().mockResolvedValue(true),
            reload: jest.fn().mockResolvedValue({
                numero: 999999,
                numUsuario: 1234,
                montoInicial: 200000,
                tiempo: "12",
                estado: "Borrador",
                tasaInteres: 0.098,
                montoGanancia: 219600
            })
        };
        solicitudCDT.findOne.mockResolvedValue(existing);

        const payload = {
            numero: "999999",
            numUsuario: "1234",
            montoInicial: "200000",
            tiempo: "12"
        };

        const result = await crearSolicitudEnBorradorCDT(payload);

        // se debe haber buscado la solicitud por el número (Number(payload.numero) en la implementación)
        expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: Number(payload.numero) } });

        // update debe ser llamado con los campos normalizados y calculados
        expect(existing.update).toHaveBeenCalledWith(expect.objectContaining({
            montoInicial: 200000,
            tiempo: "12",
            tasaInteres: expect.any(Number),
            montoGanancia: expect.any(Number)
        }));

        // la función retorna el resultado de reload()
        expect(result).toEqual(await existing.reload());
    });

});

describe("SolicitudCDTService - crearSolicitudEnValidacion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debe crear nueva solicitud en validación cuando datos válidos y no existe", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);
        solicitudCDT.create.mockImplementation(async (payload) => ({ ...payload }));

        const payload = {
            numUsuario: "1234",
            montoInicial: "150000",
            tiempo: "6"
        };

        const result = await crearSolicitudEnValidacion(payload);

        expect(solicitudCDT.findOne).toHaveBeenCalled();
        expect(solicitudCDT.create).toHaveBeenCalled();
        expect(result).toHaveProperty("numero");
        expect(result.estado).toBe("enValidacion");
        expect(result.tiempo).toBe("6");
        expect(typeof result.montoInicial).toBe("number");
    });

    it("debe actualizar un borrador existente y guardar cuando se envían nuevos monto y tiempo", async () => {
        const mockSave = jest.fn().mockResolvedValue(true);
        const existing = {
            numero: "999999",
            numUsuario: "1234",
            montoInicial: 100000,
            tiempo: "3",
            tasaInteres: 0,
            montoGanancia: 0,
            save: mockSave
        };
        solicitudCDT.findOne.mockResolvedValue(existing);

        const payload = {
            numero: "999999",
            montoInicial: "200000",
            tiempo: "12"
        };

        const result = await crearSolicitudEnValidacion(payload);

        expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: payload.numero } });
        expect(mockSave).toHaveBeenCalled();
        expect(result.estado).toBe("enValidacion");
        expect(result.montoInicial).toBe(200000);
        expect(result.tiempo).toBe("12");
    });

    it("debe rechazar al actualizar si se envía tiempo presente pero vacío", async () => {
        const existing = {
            numero: "888888",
            numUsuario: "1234",
            montoInicial: 50000,
            tiempo: "3",
            save: jest.fn()
        };
        solicitudCDT.findOne.mockResolvedValue(existing);

        const payload = {
            numero: "888888",
            tiempo: "" // Aqui con este campo vacio deberia fallar
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El tiempo es obligatorio y no puede estar vacío");
    });

    it("debe rechazar al actualizar si faltan campos requeridos", async () => {
        // Simular una solicitud existente con campos incompletos
        const solicitudExistente = {
            numero: "777777",
            numUsuario: "1234",
            montoInicial: null,  // campo requerido faltante
            tiempo: "3",
            estado: "Borrador",
            save: jest.fn()
        };
        solicitudCDT.findOne.mockResolvedValue(solicitudExistente);

        const payload = {
            numero: "777777",
            // No enviamos montoInicial ni tiempo
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("Para enviar a validación ambos campos montoInicial (>0) y tiempo (3,6,9,12) deben estar completos");
    });

    it("debe rechazar al actualizar si el tiempo no es un valor permitido", async () => {
        // Simular una solicitud existente
        const solicitudExistente = {
            numero: "777777",
            numUsuario: "1234",
            montoInicial: 100000,
            tiempo: "3",
            estado: "Borrador",
            save: jest.fn()
        };
        solicitudCDT.findOne.mockResolvedValue(solicitudExistente);

        const payload = {
            numero: "777777",
            tiempo: "5" // Valor no permitido (debe ser 3,6,9 o 12)
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El tiempo debe ser uno de los valores permitidos: 3, 6, 9 o 12");
    });

    it("debe rechazar al actualizar si el monto inicial no es un valor mayor a cero", async () => {
        // Simular una solicitud existente
        const solicitudExistente = {
            numero: "777777",
            numUsuario: "1234",
            montoInicial: 100000,
            tiempo: "3",
            estado: "Borrador",
            save: jest.fn()
        };
        solicitudCDT.findOne.mockResolvedValue(solicitudExistente);
        const payload = {
            numero: "777777",
            montoInicial: 0
        };
        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El monto inicial debe ser un número mayor a cero");
    });

    it("debe rechazar si el tiempo no es uno de los valores permitidos al crear nueva solicitud", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);

        const payload = {
            numUsuario: "1234",
            montoInicial: "150000",
            tiempo: "4" // Valor no permitido (debe ser 3,6,9 o 12)
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El tiempo es obligatorio y debe ser uno de los valores: 3, 6, 9 o 12");

        expect(solicitudCDT.create).not.toHaveBeenCalled();
    });

    it("debe rechazar si el monto inicial es un número menor a cero al crear nueva solicitud", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);

        const payload = {
            numUsuario: "1234",
            montoInicial: "0",
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El monto inicial debe ser un número mayor a cero");

        expect(solicitudCDT.create).not.toHaveBeenCalled();
    });

    it("debe rechazar si el monto inicial es un valor vacio al crear nueva solicitud", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);

        const payload = {
            numUsuario: "1234",
            montoInicial: "",
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El monto inicial debe ser un número mayor a cero");

        expect(solicitudCDT.create).not.toHaveBeenCalled();
    });

    it("debe rechazar si el tiempo NO se envía al crear nueva solicitud", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);

        const payload = {
            numUsuario: "1234",
            montoInicial: "150000"
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El tiempo es obligatorio y no puede estar vacío");

        expect(solicitudCDT.create).not.toHaveBeenCalled(); 
    });

});

    describe("SolicitudCDTService - actualizarSolicitudCDT", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it("debe actualizar el estado a Aprobada si está enValidacion", async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            const solicitudExistente = {
                numero: "123456",
                estado: "enValidacion",
                save: mockSave
            };
            solicitudCDT.findOne.mockResolvedValue(solicitudExistente);
    
            const result = await actualizarSolicitudCDT({ numero: "123456" }, "Aprobada");
    
            expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: "123456" } });
            expect(mockSave).toHaveBeenCalled();
            expect(result).toHaveProperty("mensaje");
            expect(result.mensaje).toMatch(/Aprobada/);
        });
    
        it("debe lanzar error si el estado no es enValidacion", async () => {
            solicitudCDT.findOne.mockResolvedValue({
                numero: "123456",
                estado: "Borrador",
                save: jest.fn()
            });
    
            await expect(actualizarSolicitudCDT({ numero: "123456" }, "Aprobada"))
                .rejects
                .toThrow("La solicitud solo se puede actualizar si está en estado en validacion");
        });
    
        it("debe lanzar error si el nuevo estado no es permitido", async () => {
            solicitudCDT.findOne.mockResolvedValue({
                numero: "123456",
                estado: "enValidacion",
                save: jest.fn()
            });
    
            await expect(actualizarSolicitudCDT({ numero: "123456" }, "Cancelada"))
                .rejects
                .toThrow("Solo se puede actualizar a los estados: Aprobada o Rechazada");
        });
    
        it("debe lanzar error si la solicitud no existe", async () => {
            solicitudCDT.findOne.mockResolvedValue(null);
    
            await expect(actualizarSolicitudCDT({ numero: "999999" }, "Aprobada"))
                .rejects
                .toThrow("Solicitud no encontrada");
        });
    });

    describe("SolicitudCDTService - cancelarSolicitudCDT", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("debe cancelar la solicitud si está en Borrador", async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            solicitudCDT.findOne.mockResolvedValue({
                numero: "111111",
                estado: "Borrador",
                save: mockSave
            });

            const result = await cancelarSolicitudCDT({ numero: "111111" });

            expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: "111111" } });
            expect(mockSave).toHaveBeenCalled();
            expect(result).toHaveProperty("mensaje");
            expect(result.mensaje).toMatch(/cancelada/i);
        });

        it("debe cancelar la solicitud si está en enValidacion", async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            solicitudCDT.findOne.mockResolvedValue({
                numero: "222222",
                estado: "enValidacion",
                save: mockSave
            });

            const result = await cancelarSolicitudCDT({ numero: "222222" });

            expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: "222222" } });
            expect(mockSave).toHaveBeenCalled();
            expect(result.mensaje).toMatch(/cancelada/i);
        });

        it("debe lanzar error si la solicitud no está en estado permitido", async () => {
            solicitudCDT.findOne.mockResolvedValue({
                numero: "333333",
                estado: "Aprobada",
                save: jest.fn()
            });

            await expect(cancelarSolicitudCDT({ numero: "333333" }))
                .rejects
                .toThrow("La solicitud no se puede cancelar");
        });

        it("debe lanzar error si la solicitud no existe", async () => {
            solicitudCDT.findOne.mockResolvedValue(null);

            await expect(cancelarSolicitudCDT({ numero: "444444" }))
                .rejects
                .toThrow("Solicitud no encontrada");
        });
    });

    describe("SolicitudCDTService - eliminarSolicitudCDT", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("debe eliminar la solicitud si existe", async () => {
            const mockDestroy = jest.fn().mockResolvedValue(true);
            solicitudCDT.findOne.mockResolvedValue({
                numero: "555555",
                destroy: mockDestroy
            });

            const { eliminarSolicitudCDT } = require("../Services/solicitudCDTService.js");
            const result = await eliminarSolicitudCDT({ numero: "555555" });

            expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: "555555" } });
            expect(mockDestroy).toHaveBeenCalled();
            expect(result).toHaveProperty("mensaje");
            expect(result.mensaje).toMatch(/eliminada/i);
        });

        it("debe lanzar error si la solicitud no existe", async () => {
            solicitudCDT.findOne.mockResolvedValue(null);

            const { eliminarSolicitudCDT } = require("../Services/solicitudCDTService.js");
            await expect(eliminarSolicitudCDT({ numero: "666666" }))
                .rejects
                .toThrow("Solicitud no encontrada");
        });
    });

    describe("listarSolicitudesCDTUsuario", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("devuelve todas las solicitudes del usuario (numUsuario)", async () => {
        const mockData = [
        { numero: "100", numUsuario: "1234", estado: "Borrador" },
        { numero: "101", numUsuario: "1234", estado: "enValidacion" }
        ];
        solicitudCDT.findAll.mockResolvedValue(mockData);

        const result = await listarSolicitudesCDTUsuario("1234");

        expect(solicitudCDT.findAll).toHaveBeenCalledWith({ where: { numUsuario: "1234" } });
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual(mockData);
    });

    test("lanza error cuando no hay solicitudes para el usuario", async () => {
        solicitudCDT.findAll.mockResolvedValue([]);
        await expect(listarSolicitudesCDTUsuario("1234")).rejects.toThrow("No se encontraron solicitudes");
    });
    });

    describe("listarSolicitudCDTBorrador", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("devuelve la solicitud en estado Borrador por numero", async () => {
        const mockSolicitud = { numero: "212666", estado: "Borrador", numUsuario: "98323064" };
        solicitudCDT.findOne.mockResolvedValue(mockSolicitud);

        const result = await listarSolicitudCDTBorrador("212666");

        expect(solicitudCDT.findOne).toHaveBeenCalledWith({ where: { numero: "212666", estado: "Borrador" } });
        expect(result).toEqual(mockSolicitud);
    });

    test("lanza error cuando no existe la solicitud borrador", async () => {
        solicitudCDT.findOne.mockResolvedValue(null);
        await expect(listarSolicitudCDTBorrador("999999")).rejects.toThrow("No se encontró ninguna solicitud");
    });

    });

    describe("listarSolicitudesCDTPendientesAgente", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("devuelve solicitudes pendientes (enValidacion) para el agente", async () => {
        const mockPendientes = [
        { numero: "201", estado: "enValidacion" }
        ];
        solicitudCDT.findAll.mockResolvedValue(mockPendientes);

        const result = await listarSolicitudesCDTPendientesAgente();

        expect(solicitudCDT.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockPendientes);
    });

    test("lanza error cuando no hay solicitudes pendientes", async () => {
        solicitudCDT.findAll.mockResolvedValue([]);
        await expect(listarSolicitudesCDTPendientesAgente()).rejects.toThrow("No se encontraron ningunas solicitudes pendientes");
    });

    });