import { Sequelize } from "sequelize";
<<<<<<< HEAD
const sequelize = new Sequelize("BDProyectoIngesoft2","root","Root1234",{
=======
const sequelize = new Sequelize("BDProyectoIngesoft2","root","1002",{
>>>>>>> fbb1c76dcb672a934e5bc25aadb871650b292855
    host: "localhost",
    dialect: "mysql"
});
const testConnection = async() =>{
    try{
        await sequelize.authenticate();
        console.log("Conexion con la base de datos establecida");
    }catch(error){
        console.log("Conexion con la base de datos fallida");
    }
}

testConnection();
export {sequelize, testConnection}