import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const ServeItems = sequelize.define('additems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    itemID: {
        type: DataTypes.STRING,
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})
export default ServeItems;