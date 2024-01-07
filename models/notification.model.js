import sequelize from "../config/database.js";
import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid'
const Notifications=sequelize.define('notifications',{
    notificationId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isRead:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    isSent:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    priority:{
        type:DataTypes.ENUM('normal','alert'),
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:true
    },
    receiverType: {
        type:DataTypes.ENUM('supervisor','operator','all','individual'),
        allowNull: false
    }
})
export default Notifications