import { actualizarSolicitudCDTController, crearSolicitudCDTController } from "../Controller/SolicitudCDTController";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudCDT",crearSolicitudCDTController);
router.post("/actualizarSolicitudCDT", actualizarSolicitudCDTController)
export default router;