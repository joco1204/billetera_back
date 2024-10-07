import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Billetera from './Billetera.js';

const Movimiento = sequelize.define('Movimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_billetera: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Billetera,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    token: {
        type: DataTypes.STRING(6),
        allowNull: false,
    },
    valor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cuenta_destino: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {   
        type: DataTypes.SMALLINT,
        allowNull: false,
    }
}, {
    tableName: 'movimientos',
    timestamps: false,
});

Billetera.hasMany(
    Movimiento, 
    { 
        foreignKey: 'id_billetera' 
    }
);

Movimiento.belongsTo(
    Billetera, 
    { 
        foreignKey: 'id_billetera' 
    }
);

export default Movimiento;
