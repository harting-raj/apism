//import sequelize from "../config/database.js";
import { Bins, Items, Racks } from "../models/associations.js";
import {Op} from 'sequelize';


export default {
    searchComponent: async (req, res) => {
        const { query } = req.query;
        console.log(query);
        try {
            const bins = await Bins.findAll({ where: { binID: { [Op.like]: `%${query}%` } } })
            console.log(bins)
            const items = await Items.findAll({ where: { [Op.or]: [{ itemID: { [Op.like]: `%${query}%` } }, { itemName: { [Op.like]: `%${query}%` } }, { description: { [Op.like]: `%${query}%` } }] } })
            console.log(items)
            const racks = await Racks.findAll({ where: { rackID: { [Op.like]: `%${query}%` } } })
            console.log(racks)
            res.status(200).json({ error: false, bins, items, racks })
        } catch (error) {
            res.status(400).json({ error: true, message: `Task failed:${error.message}` })
        }
    }
}