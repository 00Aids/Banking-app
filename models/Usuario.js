import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
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
    hooks:{
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
    }
})

export default Usuario