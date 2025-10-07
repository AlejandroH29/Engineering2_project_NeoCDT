import express from "express";
import cors from "cors";
import "./Config/configDatabase.js";
import "./Models/Asociaciones.js"
import {errorHandler} from "./Middlewares/ErrorHandler.js"
import UsuarioRoutes from "./Routes/UsuarioRoutes.js"
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/usuarios", UsuarioRoutes);
app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Corriendo en puerto" + " " + port);
});

