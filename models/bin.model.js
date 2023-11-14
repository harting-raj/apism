import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const Bins = sequelize.define('bins', {
    binID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    itemID: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,  
    },
    addedByID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    assignedByID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    lastAccessedBy:{
        type: DataTypes.UUID,
        allowNull: true,
    },
    positionID: {
        type: DataTypes.INTEGER,
        //primaryKey: true,
        //autoIncrement: true,
        allowNull: false
    },
    rackID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
  })

export default Bins