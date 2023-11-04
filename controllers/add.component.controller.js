import sequelize from '../config/database.js';
import { Items, Racks, Bins, Positions } from '../models/associations.js';


export default {
    addRack: async (req, res) => {
        try {
            const rackData = req.body; // expecting the array of the stack data
            if (!rackData) {
                res.status(400).json({ error: true, message: `Operation failed: Body don't have data` });
            } else {
                const rackIds = rackData.map((json) =>
                    json.rackID
                )
                //console.log(rackIds);
                const addedRackData = await Racks.findAll({ where: { rackID: rackIds } });
                const addedRack = addedRackData.map((data) => data.rackID)
                if (addedRack.length > 0) {
                    res.status(400).json({ error: true, message: `Operation failed: racks ${addedRack} already added ` });
                }

                else {
                    await sequelize.transaction(async (t) => {
                        const racks = await Racks.bulkCreate(rackData, { transaction: t });
                        // automatically generating the positions and assign names for each stack
                        const positions = [];
                        racks.forEach(element => {
                            for (let row = 1; row <= element.row; row++) {
                                for (let column = 1; column <= element.column; column++) {
                                    const positionname = String.fromCharCode(64 + row) + column;
                                    positions.push({ rackID: element.rackID, rowNumber: row, columnNumber: column, positionName: positionname })
                                }
                            }
                        });
                        await Positions.bulkCreate(positions, { transaction: t });

                    })
                    res.status(201).json({ error: false, message: "Racks added Successfully" });
                }
            }

        } catch (error) {
            res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
        }

    },
    addBin: async (req, res) => {
        try {
            const binData = req.body;
            if (!binData) {
                res.status(400).json({ error: true, message: "Operation failed: Body don't have data" });
            } else {
                const binIds = binData.map((bin) => bin.binID);
                const addedBinsDetail = await Bins.findAll({ where: { binID: binIds } });
                const addedBins = addedBinsDetail.map((bin) => bin.binID)
                if (addedBinsDetail.length > 0) {
                    res.status(400).json({ error: true, message: `Operation failed: bins ${addedBins} already added ` });
                } else {
                    const positionIds = binData.map((bin) => bin.positionID);
                    const positions = await Positions.findAll({ where: { positionID: positionIds } });
                    if (positions.lenght !== positionIds.lenght) {
                        res.status(404).json({ error: true, message: "Operation failed: Associated positions not found for all bins" });
                    }
                    else {
                        const bins = await Bins.bulkCreate(binData, { individualHooks: true });
                        res.status(201).json({ error: false, message: "Bins added Successfully" });
                    }

                }
            }

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
        }
    },
    addItem: async (req, res) => {
        /*  Expecting input like this.
        [
        {
      "itemID":"it@43",
      "itemName":"Capcitor",
      "binIDs":[["b@126",50],["b@125",60]],
       "quantity":200,
       "manufacturer":"Harting",
       "reorderLevel":20,
       "expiryDate":"2023-09-27 10:42:03",
       "maxLimit":200
        },
        {
      "itemID":"it@43",
      "itemName":"Capcitor",
       "binIDs":[["b@126",50],["b@125",60]],
       "quantity":200,
       "manufacturer":"Harting",
       "reorderLevel":20,
       "expiryDate":"2023-09-27 10:42:03",
       "maxLimit":200
        }
        ]
        */
        const itemData = req.body;
        if (!itemData) {
            res.status(400).json({ error: true, message: "Operation failed: Body don't have data" });
        }
        else {
            try {
                sequelize.transaction(async (t) => {
                    await Promise.all(itemData.map(async (item) => {
                        const { binIDs, ...itemInfo } = item;
                        const itemIsPresent = await Items.findByPk(itemInfo.itemID, { transaction: t });

                        if (itemIsPresent) {
                            itemIsPresent.totalQuantity += itemInfo.totalQuantity;
                            await itemIsPresent.save({ transaction: t })
                        } else {
                            await Items.create(itemInfo, { transaction: t });
                        }

                        await Promise.all(

                            binIDs.map(async (binInfo) => {

                                const bin = await Bins.findByPk(binInfo[0]);
                                if (bin.itemID !== itemInfo.itemID && bin.quantity > 0) {
                                    res.status(400).json({ error: false, message: "Bin already have item" })
                                }
                                else {
                                    bin.itemID = itemInfo.itemID;
                                    bin.quantity = bin.quantity + binInfo[1];
                                    await bin.save({ transaction: t })
                                }

                            }))
                    }))


                    res.status(200).json({ error: false, message: "Items added successfully" })
                })
            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        }

    },
    addLevel: async (req, res) => {
        const { rackID, row } = req.body;
        console.log(rackID, row);
        if (rackID && row) {
            try {
                const rack = await Racks.findByPk(rackID);
                const intitRow = rack.row;
                sequelize.transaction(async (t) => {
                    rack.row = intitRow + row;
                    const positions = [];
                    await rack.save({ transaction: t })
                    for (let rows = 1; rows <= row; rows++) {
                        for (let columns = 1; columns <= rack.column; columns++) {
                            const positionname = String.fromCharCode(64 + (rows + intitRow)) + columns;
                            positions.push({ rackID: rackID, rowNumber: (intitRow + rows), columnNumber: (rack.column + columns), positionName: positionname })
                        }
                    }
                    await Positions.bulkCreate(positions, { transaction: t });
                })
                res.status(201).json({ error: false, message: "Level added Successfully" });

            } catch (error) {
                res.status(500).json({ error: true, message: `Operation failed: ${error.message}` });
            }
        }
        else {
            res.status(400).json({ error: true, message: "Operation failed: requires all field" });
        }
    }
}
