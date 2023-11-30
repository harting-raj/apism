import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const TransferBin=sequelize.define('transferbin',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull:false,
    },
    taskID:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    destinationRackID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   sourceRackID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    binID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    destinationPositionID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    sourcePositionID:{
        type:DataTypes.STRING,
        allowNull:false,
    }

})

export default TransferBin