import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion, actualizarSolicitudCDT, cancelarSolicitudCDT, eliminarSolicitudCDT } from "../Services/solicitudCDTService.js";

jest.mock("../Models/solicitudCDTModel.js", () => ({
    solicitudCDT: {
        findOne: jest.fn(),
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
});

describe("SolicitudCDTService - crearSolicitudEnValidacion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debe rechazar si el body incluye tiempo vacío", async () => {
        const payload = {
            numUsuario: "1234",
            montoInicial: 100000,
            tiempo: "" // Aqui con este campo vacio deberia fallar
        };

        await expect(crearSolicitudEnValidacion(payload)).rejects.toThrow("El tiempo es obligatorio y no puede estar vacío");
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

});