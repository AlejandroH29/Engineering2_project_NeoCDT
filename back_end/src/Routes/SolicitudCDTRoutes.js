import { crearSolicitudCDTController } from "../Controller/SolicitudCDTController";
import { Router } from "express";

const router = Router();

router.post("/crearSolicitudCDT",crearSolicitudCDTController);
export default router;