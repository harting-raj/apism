import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const BinLastAccessed = sequelize.define('last_access', {
    Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    binId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rackId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

})

export default BinLastAccessed