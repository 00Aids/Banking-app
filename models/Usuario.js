import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identificacion: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    cuenta: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    dinero: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rol: {
        type: DataTypes.ENUM('administrador', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
})

export default Usuario