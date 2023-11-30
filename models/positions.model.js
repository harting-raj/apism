import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Positions = sequelize.define('positions', {
    positionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rowNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    columnNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    positionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lockStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lightStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rackID: {
        type: DataTypes.STRING,
        allowNull: false,
    }


},{
    timestamps: false
  })

// Positions.hasOne(Bins, { foreignKey: 'positionID', allowNull: false, as: 'bin' })

export default Positions;