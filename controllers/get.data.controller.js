import { Sequelize, where, Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Bins, Users, Racks, Items, Positions } from '../models/associations.js'
import { binList, itemList, emptyBinsList } from '../utils/utils.js';
import Notifications from '../models/notification.model.js';


export default {
    getComponentCount: async (req, res) => {
        try {
            const rack = {};
            const bin = {};
            const item = {};
            const employee = {}
            // count rack, available positions and occupied positions.
            const totalRacks = await Racks.count() ?? 0;
            const positions = {};
            const availablePosition = await Positions.count() ?? 0;
            const occupied = await Bins.count() ?? 0;
            positions.available = availablePosition ?? 0;
            positions.occupied = occupied ?? 0;
            rack.totalracks = totalRacks ?? 0;
            rack.positions = positions ?? 0;

            //count bins and empty bins
            bin.total = occupied ?? 0;
            const occupiedBins = await Items.count({
                include: {
                    model: Bins, as: 'bins'
                }
            }) ?? 0

            // total items and distinct items
            // item.totalItems = await Items.sum('totalQuantity') ?? 0;
            item.totalItems = await Items.sum('totalQuantity') ?? 0;
            console.log(item.totalItems);
            const itemCount = await Items.findAndCountAll({ attributes: [sequelize.fn('DISTINCT', sequelize.col('itemID'))] }) ?? 0;
            item.distinctItems = itemCount.count ?? 0;
            bin.empty = occupied - occupiedBins ?? 0;

            //operator and supervisors

            const operator = await Users.count({
                where: {
                    role: 'operator',
                }
            }) ?? 0;
            const supervisors = await Users.count({
                where: {
                    role: 'supervisor'
                }
            }) ?? 0

            employee.operators = operator;
            employee.supervisors = supervisors
            res.status(200).json({ rack, bin, item, employee })
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })

        }
    },
    getRackList: async (req, res) => {
        try {
            const totalRacks = await Racks.count() ?? 0;
            if (totalRacks <= 0) {

                res.status(200).json({ rackList: [] });
            } else {
                const rackList = await Racks.findAll({
                    attributes: ['rackID', 'row', 'column', [sequelize.fn('COUNT', sequelize.col('bins.binID')), 'binCount']],
                    include: [{ model: Bins, as: 'bins', attributes: [] }], group: ['racks.rackID']
                    // limit: 2,
                    // offset: 2
                })
                res.status(200).json({ rackList })
            }
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getRackDetail: async (req, res) => {
        try {
            const { rackID } = req.params;
            console.log(rackID);
            const rackDetail = {};

            const rack = await Racks.findOne({ where: { rackId: rackID } });


            rackDetail.rack = rack;
            rackDetail.binList = await binList(rackID);
            rackDetail.itemList = await itemList(rackID);
            rackDetail.emptyBinsList = await emptyBinsList(rackID);

            res.status(200).json({ error: false, rackDetail });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getBinList: async (req, res) => {
        try {
            const { rackID } = req.body;
            const binLists = await binList(rackID);
            res.status(200).json({ error: false, binLists });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getItemList: async (req, res) => {
        try {
            const { rackID } = req.body;
            const list = await itemList(rackID);
            res.status(200).json({ error: false, list });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getEmptyBins: async (req, res) => {
        try {
            const { rackID } = req.body;
            const list = await emptyBinsList(rackID);
            res.status(200).json({ error: false, list });
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getBinDetail: async (req, res) => {
        const { binID } = req.params;
        if (binID) {
            try {

                let binDetail = await Bins.findOne({ where: { binID: binID }, attributes: ["binID", "rackID", "itemID", "quantity", "positionID"], include: [{ model: Items, as: 'item', attributes: ['itemID', 'itemName', 'manufacturer', 'expiryDate', 'totalQuantity'] }] })
                if (binDetail) {

                    const position = await Positions.findOne({ where: { positionID: binDetail.positionID } })
                    console.log(position);
                    binDetail.dataValues.positionName = position ? position.positionName : '';

                    res.status(200).json({ error: false, binDetail });
                } else {
                    res.status(404).json({ error: true, message: "Bin Id not in the database" });
                }

            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "Bin ID not found" })
        }
    },
    getItemDetail: async (req, res) => {
        const { itemID } = req.params;
        if (itemID) {
            try {
                const itemDetail = await Items.findOne({ where: { itemID: itemID }, include: { model: Bins, as: 'bins', attributes: ['binID', 'rackID', 'quantity'], } });
                res.status(200).json({ error: false, itemDetail });
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "Item ID not found" })
        }
    },
    getUserList: async (req, res) => {
        const { role } = req.params;
        // console.log("\n", role);
        if (role) {
            try {

                const userList = await Users.findAll({ where: { role: role }, attributes: ['id', 'firstName', 'lastName', 'email', 'contactNumber'] })
                res.status(200).json({ error: false, userList });
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
            }
        } else {
            res.status(400).json({ error: true, message: "User role not found" })
        }
    },
    getRackWithPosition: async (req, res) => {
        try {
            const totalRacks = await Racks.count() ?? 0;
            if (totalRacks <= 0) {

                res.status(200).json({ rackList: [] });
            } else {
                sequelize.query('Select racks.rackID, positions.positionName, positions.positionID from racks LEFT JOIN positions On racks.rackID=positions.rackID LEFT JOIN bins ON positions.positionID=bins.positionID WHERE bins.positionID IS NULL', { type: Sequelize.QueryTypes.SELECT, model: Racks, mapToModel: true }).then((results) => {
                    // console.log(results);
                    const rackList = [];

                    results.forEach((result) => {
                        // console.log(result.dataValues);
                        const { rackID } = result;
                        const positionName = result.dataValues.positionName;
                        const positionID = result.dataValues.positionID;
                        if (rackID && positionName && positionID) {
                            let rack = Object.values(rackList).find((item) => item.rackID === rackID);
                            if (!rack) {
                                rack = {
                                    rackID,
                                    position: [],
                                    positionID: []
                                };
                                rackList.push(rack);
                            }

                            rack.position.push(positionName);
                            rack.positionID.push(positionID);
                        }
                    });
                    res.status(200).json({ rackList });
                })

            }
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getRackWithBins: async (req, res) => {
        try {
            const totalRacks = await Racks.count() ?? 0;
            //  const { itemID } = req.params;
            if (totalRacks <= 0) {

                res.status(200).json({ rackList: [] });
            } else {
                const rackList = await Racks.findAll(
                    {
                        attributes: ['rackID',],
                        include: [{ model: Bins, as: 'bins', attributes: ['binID', 'quantity', 'category'], where: { quantity: { [Op.lt]: 60 } } }],
                        having: Sequelize.literal('Count(bins.binID)>0'),
                        group: ['bins.binID']
                    }
                )
                res.status(200).json({ rackList });
            }
        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    },
    getNotification:async(req,res)=>{
        try{
         const notifications=await Notifications.findAll();
        // console.log(notifications);
         res.status(200).json({error:true,notifications});
        }catch(error){
            res.status(500).json({ error: true, message: `Operation failed : ${error.message}` })
        }
    }
}