import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid'

const Items = sequelize.define('items', {
    itemID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxLimit: { // maximum number of item in a bin
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reorderLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagePathUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    temperature: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    humidity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reorderQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{
    timestamps: false
  })



export default Items