import { actualizarSolicitudCDTController, crearSolicitudCDTController, eliminarSolicitudCDTController, cancelarSolicitudCDTController, listarSolicitudesCDTUsuarioController, listarSolicitudesCDTEstadoController } from "../Controller/SolicitudCDTController.js";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudCDT",crearSolicitudCDTController);
router.put("/actualizarSolicitudCDT", actualizarSolicitudCDTController);
router.put("/cancelarSolicitudCDT/:numero", cancelarSolicitudCDTController)
router.delete("/eliminarSolicitudCDT/:numero", eliminarSolicitudCDTController);
router.get("/listarSolicitudesUsuario/:numUsuario", listarSolicitudesCDTUsuarioController);
router.get("/listarSolicitudesEstado", listarSolicitudesCDTEstadoController);

export default router;