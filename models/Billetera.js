import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Cliente from './Cliente.js';

const Billetera = sequelize.define('Billetera', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    saldo: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    }
}, {
    tableName: 'billetera',
    timestamps: false,
});

Cliente.hasOne(
    Billetera, 
    { 
        foreignKey: 'id_cliente' 
    }
);

Billetera.belongsTo(
    Cliente, 
    { 
        foreignKey: 'id_cliente' 
    }
);

export default Billetera;
