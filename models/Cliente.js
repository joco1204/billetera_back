import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    documento: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    celular: {
        type: DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    tableName: 'clientes',
    timestamps: false,
});

export default Cliente;
