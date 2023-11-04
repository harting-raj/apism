import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';

const Tasks = sequelize.define('tasks', {
    taskID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    },
    supervisorID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    taskType: {
        type: DataTypes.ENUM("serveItem", "addItem", "addBin", "transferBin", "transferItem"),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1, 2, 3]] //0: new, 1:accepted,2:held,3:completed
        }
    },
    operatorID: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    createdAT: {
        type: DataTypes.DATE,
        allowNull: false
    },
    completedAT: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
})
export default Tasks;