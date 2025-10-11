import { actualizarSolicitudCDTController, crearSolicitudCDTController } from "../Controller/SolicitudCDTController.js";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudCDT",crearSolicitudCDTController);
router.put("/actualizarSolicitudCDT", actualizarSolicitudCDTController)
export default router;