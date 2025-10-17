jest.mock("../Models/solicitudCDTModel.js", () => ({
    solicitudCDT: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

import { solicitudCDT } from "../Models/solicitudCDTModel.js";
import { crearSolicitudEnBorradorCDT, crearSolicitudEnValidacion } from "../Services/solicitudCDTService.js";

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
});