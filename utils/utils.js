import sequelize from '../config/database.js';
import { Bins, Users, Racks, Items, Positions } from '../models/associations.js'
import { Sequelize, DataTypes, Op } from 'sequelize';

async function binList(rackID) {

    const list = await Bins.findAll({
        where: rackID ? { rackID: rackID } : {},
        attributes: ['binID', 'rackID', 'positionID', 'quantity'],
        include: [
            {
                model: Items, as: 'item', attributes: ['itemID',],
            }]
    })
    return list;

}
async function itemList(rackID) {

    if (rackID) {
        const List = await Bins.findAll({ where: { rackID: rackID, itemID: { [Op.not]: null } }, attributes: [], include: [{ model: Items, as: 'item', attributes: ['itemID', 'itemName', 'manufacturer'] }] });
        return List;
    }
    else {
        const List = await Items.findAll({ attributes: ['itemID', 'itemName', 'manufacturer'] });
        return List;
    }


}
async function emptyBinsList(rackID) {

    if (rackID) {
        const List = await Bins.findAll({ where: { rackID: rackID, itemID: null }, attributes: ['binID', 'rackID', 'positionID'], });
        return List;
    } else {
        const List = await Bins.findAll({
            where: {
                [Op.or]: [
                    { itemID: null },
                    { quantity: 0 }
                ]
            }, attributes: ['binID', 'rackID', 'positionID'],
        })
        return List;
    }

}
export { binList, itemList, emptyBinsList }

