import Users from "./user.model.js";
import Racks from './rack.model.js';
import Positions from "./positions.model.js";
import Bins from './bin.model.js'
import Items from "./item.model.js";
import AddItems from "./add.items.models.js";
import ServeItems from "./serve.items.models.js";
import TransferBin from "./transfer.bin.model.js";
import TransferItem from "./transferItem.js";
import Tasks from "./task.model.js";
import AddBins from "./add.bin.model.js";


Racks.belongsTo(Users, { foreignKey: 'addedByID', as: 'addedByUser' });
Racks.hasMany(Positions, { foreignKey: 'rackID', targetKey: 'rackID', as: 'positions' })
Racks.hasMany(Bins, { foreignKey: 'rackID', targetKey: 'rackID', as: 'bins' })
Items.hasMany(Bins, { foreignKey: 'itemID', targetKey: 'itemID', as: 'bins' })
Positions.belongsTo(Racks, { foreignKey: 'rackID', tartgetKey: 'rackID', as: 'rack' });
Positions.hasOne(Bins, { foreignKey: 'positionID', targetKey: 'positionID', as: 'position' })
Bins.belongsTo(Users, { foreignKey: 'addedByID', as: 'addedByUser' });
Bins.belongsTo(Users, { foreignKey: 'lastAccessedBy', as: 'lastAccessedByUser' });
Bins.belongsTo(Users, { foreignKey: 'assignedByID', as: 'assignedByUser' });
Bins.belongsTo(Positions, { foreignKey: 'positionID', targetKey: 'positionID', as: 'bin' });
Bins.belongsTo(Racks, { foreignKey: 'rackID', tartgetKey: 'rackID', as: 'rack' });
Bins.belongsTo(Items, { foreignKey: 'itemID', targetKey: 'itemID', as: 'item' })


//task

Tasks.hasMany(AddItems, { foreignKey: 'taskID', as: 'addItems' }),
Tasks.hasMany(ServeItems, { foreignKey: 'taskID', as: 'serveItems' }),
    Tasks.hasMany(TransferBin, { foreignKey: 'taskID', as: 'transferBins' }),
    Tasks.hasMany(TransferItem, { foreignKey: 'taskID', as: 'transferItems' })
Tasks.hasMany(AddBins, { foreignKey: 'taskID', as: 'addBins' })
ServeItems.belongsTo(Tasks, { foreignKey: 'taskID', as: 'task' })
AddItems.belongsTo(Tasks, { foreignKey: 'taskID', as: 'task' })
TransferItem.belongsTo(Tasks, { foreignKey: 'taskID', as: 'task' })
TransferBin.belongsTo(Tasks, { foreignKey: 'taskID', as: 'task' })
AddBins.belongsTo(Tasks, { foreignKey: 'taskID', as: 'task' })

Tasks.belongsTo(Users, { foreignKey: 'supervisorID', as: 'supervisor' })
Tasks.belongsTo(Users, { foreignKey: 'operatorID', as: 'operator' })

export {
    Racks,
    Items,
    Users,
    Positions,
    AddItems,
    ServeItems,
    TransferBin,
    TransferItem,
    AddBins,
    Bins,
    Tasks,

}