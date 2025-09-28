import express from "express";
import "./Config/configDatabase.js";
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, ()=>{
    console.log("Corriendo en puerto" + " " + port);
});