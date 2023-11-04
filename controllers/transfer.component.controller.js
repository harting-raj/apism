import {Bins,Items} from '../models/associations.js';
import sequelize from '../config/database.js';


export default {
    transferBin: async (req, res) => {
        const { binID, newPositionID, newRackID } = req.binID;
        if (binID) {
            try {
                const bin = await Bins.findByPk(binID);
                const checkBin = await Bins.findAll({
                    where: {
                        rackID: newRackID,
                        positionID: newPositionID
                    }
                })
                if (checkBin.length > 0) {
                    res.status(400).json({ error: true, message: "New position already occupied" })
                } else {
                    if (bin) {
                        bin.positionID = newPositionID;
                        bin.rackID = newRackID;
                        await bin.save();
                        res.status(200).json({ error: false, message: "Bin tranfererd successfully" })
                    } else {
                        res.status(400).json({ error: true, message: `There is no bin with id ${binID}` })
                    }
                }
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }

        } else {
            res.status(400).json({ error: true, message: "Bin ID is required" })
        }
    },
    transferItem: async (req, res) => {
        const { itemID, newBinID } = req.body;
        if (itemID && newBinID) {
            const Item = Items.findOne({ where: { itemID: itemID } });
            const destinationItem = Items.findOne({ where: { binID: newBinID } })
            if (Item.itemID === destinationItem.itemID) {
                if ((Item.quantity + destinationItem.quantity) <= Item.maxLimit) {
                    sequelize.transaction(async (t) => {
                        destinationItem += Item.quantity;
                        await Items.destroy({
                            where: {
                                id: Item.id
                            }
                        }, { transaction: t })
                        await Item.save({ transaction: t });
                    })
                    res.status(200).json({ error: false, message: "Item merged successfully" })
                } else {
                    res.status(400).json({ error: true, message: "Merging Quantity is exceeding max limit" })
                }
            } else {
                if (destinationItem.quantity === 0) {
                    sequelize.transaction(async (t) => {
                        await Items.destroy({
                            where: {
                                id: destinationItem.id
                            }
                        }, { transaction: t })
                        Item.binID = destinationItem.binID;
                        await Item.save({ transaction: t })
                    })
                    res.status(200).json({ error: false, message: "Item tranfererd successfully" });
                } else {
                    res.status(400).json({ error: true, message: "Destination bin already have items" })
                }
            }
        }
        else {
            res.status(400).json({ error: true, message: "Both Bin ID and Item ID are required" })
        }
    }
}