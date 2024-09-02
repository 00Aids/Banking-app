import Sequelize from 'sequelize';
import dotenv from 'dotenv'; // Importamos dotenv

dotenv.config({ path: '.env' }); // Le decimos donde se encuentra ubicado, en este caso le decimos que en la raíz del proyecto y el archivo .env

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT, // Asegúrate de que el puerto esté configurado correctamente
    dialect: 'postgres', // Cambiamos a 'postgres'
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0, // Configura cómo va a ser el comportamiento para conexiones nuevas o existentes, mantiene o reutiliza las conexiones que estén vivas. Máximo 5 conexiones va a tratar de mantener.
        acquire: 30000, // 30 segundos, tiempo que va a pasar tratando de lograr una conexión antes de marcar un error.
        idle: 10000 // 10 seg en lo que ve que no hay nada de movimiento; en lo que no hay nada, todo tranquilo así que da 10 segundos para que la conexión se finalice.
    },
    operatorAliases: false
});

export default db;