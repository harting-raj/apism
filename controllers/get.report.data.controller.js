import sequelize from '../config/database.js';
import { Sequelize, Op } from 'sequelize';
import { Bins, Users, Racks, Items, Positions, Tasks } from '../models/associations.js'
import BinLastAccessed from '../models/bin.last.accessed.js';

export default {
    getTaskNumber:async(req,res)=>{
        try {
            const today= new Date();
            const startOfDay=new Date(today.getFullYear(),today.getMonth(),today.getDate());
const totalTask=await Tasks.count();
const todayTask=await Tasks.count({where:{createdAt:{[Op.gte]:startOfDay,[Op.lt]:new Date(today.getFullYear(),today.getMonth(),today.getDate()+1),}}})    
res.status(200).json({ error: false, totalTask,todayTask });       
        } catch (error) {
            res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
        }
    },
    getTopOrder: async (req, res) => {
        try {

        } catch (error) {
            res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
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
            const expiredItems = Items.findAll({ where: Sequelize.literal(`STR_TO_DATE(expiryDate,'%Y-%m-%d %H:%i:%s')>'${currentDate.toISOString()}'`), attributes: ['itemID', 'totalQuantity', 'itemName', 'manufacturer']})
            res.status(200).json({ error: false, expiredItems });
        } catch (error) {
            res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
        }

    },
    getLastAccessedList:async(req,res)=>{
        const {binID}=req.body;
   try{
    let lastAccessedList;
  if(binID!=null){
     lastAccessedList=await BinLastAccessed.findAll({where:{binId:binID}, attributes: { exclude: ['Id'] }})
  }
  else{
    lastAccessedList=await BinLastAccessed.findAll({attributes: { exclude: ['Id'] }});
  }
  res.status(200).json({ error: false, lastAccessedList });
   }catch(error){
    res.status(500).json({ error: false, message: `Nothing to show : ${error.message}` })
   }
    }
}