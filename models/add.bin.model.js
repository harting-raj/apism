import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const AddBins=sequelize.define('addbins',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    position:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    positionID:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    rackID:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true,
    }
})

export default AddBins