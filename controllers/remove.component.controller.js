import sequelize from '../config/database.js';
import { Positions, Bins, Items } from '../models/associations.js';
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

                                await bin.update({ itemID: null ,quantity:0}, { transaction: t });
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
    removeBin: async (req, res) => {
        const { binID } = req.body;
        if (binID) {
            try {
                const bin = await Bins.findByPk(binID);
                if (bin) {
                    if (bin.quantity <= 0) {
                        sequelize.transaction(async () => {
                            bin.itemID = null;
                            await bin.save()
                            await Bins.destroy({ where: { binID: bin.binID } })
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