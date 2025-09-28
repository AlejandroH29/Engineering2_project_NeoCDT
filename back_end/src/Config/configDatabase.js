import { Sequelize } from "sequelize";
const sequelize = new Sequelize("","","",{
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