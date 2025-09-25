import express from "express";
const app = express();
const port = 3000;

app.post("/crearPeticion", (req, res)=>{
    res.send("");
});

app.put("/actualizarPeticion", (req,res)=>{
    res.send("");
});

app.delete("/eliminarPeticion", (req,res)=>{
    res.send("");
});

app.listen(port, ()=>{
    console.log("Corriendo");
});