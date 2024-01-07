import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const AddItems = sequelize.define('additems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    taskID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rackID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    binID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    itemID: {
        type: DataTypes.STRING,
        //primaryKey: true,
        allowNull: false
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
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
    },
    positionName: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false
})



export default AddItems