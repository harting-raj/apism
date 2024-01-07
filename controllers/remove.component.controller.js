import sequelize from '../config/database.js';
import { Positions, Bins, Items } from '../models/associations.js';
import { io } from "../app.js"

import Notifications from '../models/notification.model.js';
export default {
    removeItem: async (req, res) => {
        const { itemID } = req.params;
        if (itemID) {
            try {
                const Item = await Items.findByPk(itemID);
                if (Item) {
                    sequelize.transaction(async (t) => {
                        const bins = await Bins.findAll({ where: { itemID: itemID } });
                        await Promise.all(
                            bins.map(async (bin) => {

                                await bin.update({ itemID: null, quantity: 0 }, { transaction: t });
                            }
                            )
                        )

                        Items.destroy({ where: { itemID: itemID } }, { transaction: t });
                        res.status(200).json({ error: false, message: "Item removed successfully" });

                    })

                } else {
                    res.status(400).json({ error: true, message: `Operation failed: Item no found` });
                }
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        } else {
            res.status(400).json({ error: true, message: "Operation failed: Item ID is required" });

        }
    },
    serveItem: async (req, res) => {
        const serveItemData = req.body.items;
        const { supervisor, operator } = req.body;
        console.log(serveItemData);
        if (serveItemData) {
            try {
                sequelize.transaction(async (t) => {
                    await Promise.all(serveItemData.map(async (item) => {
                        const bin = await Bins.findOne({ where: { binID: item.binID } }, { transaction: t });
                        const items = await Items.findOne({ where: { itemID: item.itemID } }, { transaction: t });
                        bin.quantity = bin.quantity - item.quantity;
                        items.totalQuantity = items.totalQuantity - item.quantity;
                        await bin.save({ transaction: t });
                        await items.save({ transaction: t });
                        if(items.totalQuantity<=reorderLevel){
                            await Notifications.create({ title: 'Low Quantity', message: `The item ${items.itemName} is low on quantity.`,receiverType:'supervisor',priority:'alert' });
                            io.emit("supervisor-notify")
                        }
                        const operatorDetail = await Users.findByPk(operator);
                    await Notifications.create({ title: 'Task Completed', message: `The task of serving item is completed by ${operatorDetail.firstName}`,receiverType:'supervisor',priority:'normal' })
                    io.emit("database-updated");
                    io.emit("supervisor-notify", supervisor);

                        res.status(200).json({ error: false, message: "Item served successfully" })

                    }))
                })
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        } else {
            res.status(400).json({ error: true, message: "Internal server error" });
        }
    },
    removeBin: async (req, res) => {
        const { binID } = req.body;
        if (binID) {
            try {
                const bin = await Bins.findByPk(binID);
                if (bin) {
                    if (bin.quantity <= 0) {
                        sequelize.transaction(async (t) => {
                            bin.itemID = null;
                            await bin.save({ transaction: t })
                            await Bins.destroy({ where: { binID: bin.binID } }, { transaction: t })
                        })
                        res.status(200).json({ error: false, message: "Bin removed successfully" })
                    }
                    else {
                        res.status(400).json({ error: true, message: `Operation failed: Bin with id: ${binID} is not empty` });
                    }
                }
                else {
                    res.status(400).json({ error: true, message: `Operation failed: Bin with id: ${binID} not found` });
                }

            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        } else {
            res.status(400).json({ error: true, message: "Operation failed: Bin ID is required" });

        }
    },
    removeRack: async (req, res) => {
        const { rackID } = req.body;
        if (rackID) {
            try {
                const bins = await Bins.findAll({
                    where: {
                        binID: binId
                    }
                })
                if (bins.length > 0) {
                    res.status(400).json({ error: true, message: "Operation failed: Rack is not empty" });
                }
                else {
                    sequelize.transaction(async (t) => {
                        await Positions.destroy({
                            where: {
                                rackID: rackID
                            }
                        }, { transaction: t })
                        await Racks.destroy({
                            where: {
                                rackID: rackID
                            }
                        }, { transaction: t })
                    })
                }
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        }
        else {
            res.status(400).json({ error: true, message: "Operation failed: rack ID is required" });

        }
    }

}