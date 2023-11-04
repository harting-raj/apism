import sequelize from '../config/database.js';
import { Sequelize, Op } from 'sequelize';
import { Bins, Users, Racks, Items, Positions } from '../models/associations.js'

export default {
    getTopOrder: async (req, res) => {
        try {

        } catch (error) {

        }
    },
    getLowQuantityItems: async (req, res) => {
        try {
            const lowQunatityItem = await Items.findAll({ where: { totalQuantity: { [Op.lt]: Sequelize.col('reorderLevel') } }, attributes: ['itemID', 'totalQuantity', 'itemName', 'manufacturer'] })
            res.status(200).json({ error: false, lowQunatityItem });
        } catch (error) {
            res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
        }
    },
    getExpiredItems: async (req, res) => {
        try {
            const currentDate = new Date();
           // const expiryDate= Items.findOne({where:{}})
            //console.log(currentDate)
            const expiredItems = Items.findAll({ where: Sequelize.literal(`STR_TO_DATE(expiryDate,'%Y-%m-%d %H:%i:%s')>'${currentDate.toISOString()}'`), })
            res.status(200).json({ error: false, expiredItems });
        } catch (error) {
            res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
        }

    }
}