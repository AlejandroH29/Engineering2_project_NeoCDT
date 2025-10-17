import { actualizarSolicitudCDTController, crearSolicitudEnBorradorCDTController, crearSolicitudEnValidacionController,eliminarSolicitudCDTController, cancelarSolicitudCDTController, listarSolicitudesCDTUsuarioController, listarSolicitudesCDTEstadoController } from "../Controller/SolicitudCDTController.js";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudEnBorradorCDT",crearSolicitudEnBorradorCDTController);
router.post("/crearSolicitudEnValidacion", crearSolicitudEnValidacionController);
router.put("/actualizarSolicitudCDT", actualizarSolicitudCDTController);
router.put("/cancelarSolicitudCDT/:numero", cancelarSolicitudCDTController)
router.delete("/eliminarSolicitudCDT/:numero", eliminarSolicitudCDTController);
router.get("/listarSolicitudesUsuario/:numUsuario", listarSolicitudesCDTUsuarioController);
router.get("/listarSolicitudesEstado/:numUsuario", listarSolicitudesCDTEstadoController);

export default router;