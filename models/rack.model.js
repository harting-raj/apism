import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Racks = sequelize.define('racks', {
    rackID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    row: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    column: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addedByID: {
        type: DataTypes.UUID,
        allowNull: false,
    }

},{
    timestamps: false
  });




export default Racks;