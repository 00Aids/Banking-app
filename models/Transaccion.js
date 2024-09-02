import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Transaccion = db.define('transacciones', {
    envia: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    recibe: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    dinero: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

export default Transaccion;