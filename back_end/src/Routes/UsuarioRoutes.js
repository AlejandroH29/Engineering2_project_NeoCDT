import { crearUsuarioController } from "../Controller/UsuarioController.js";
import { validarInicioSesionController } from "../Controller/UsuarioController.js";
import { Router } from "express";

const router = Router();

router.post("/crearUsuario",crearUsuarioController);
router.post("/validarSesion", validarInicioSesionController);
export default router;