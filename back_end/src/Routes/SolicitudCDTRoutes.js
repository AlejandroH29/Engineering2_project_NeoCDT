import { actualizarSolicitudCDTController, crearSolicitudCDTController, eliminarSolicitudCDTController } from "../Controller/SolicitudCDTController.js";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudCDT",crearSolicitudCDTController);
router.put("/actualizarSolicitudCDT", actualizarSolicitudCDTController);
router.delete("/eliminarSolicitudCDT/:numero", eliminarSolicitudCDTController);
export default router;