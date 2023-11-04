import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const TransferItem=sequelize.define('transferitem',{
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
    itemID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    destinationBinID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    sourceBinID:{
        type:DataTypes.STRING,
        allowNull:false,
    }

})

export default TransferItem