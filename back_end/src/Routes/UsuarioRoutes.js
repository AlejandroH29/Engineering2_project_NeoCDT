import { crearUsuarioController } from "../Controller/UsuarioController.js";
import { Router } from "express";

const router = Router();

router.post("/crearUsuario",crearUsuarioController);
export default router;