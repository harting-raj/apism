import sequelize from "../config/database.js";
//import socketModule from "../app.js";
import { Users, AddBins, AddItems, ServeItems, Tasks, TransferBin, TransferItem, Bins, Positions, Items } from '../models/associations.js'
import { io } from "../app.js"
import { Op } from "sequelize";

export default {
  addItemTask: async (req, res) => {
    const { supervisorID, items } = req.body;
    if (supervisorID && items) {
      try {
        const currentDate = new Date();
        console.log(currentDate)
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'addItem', createdAT: currentDate, }, { transaction: t });
          const promises = items.map(async (element) => {
            element.taskID = task.taskID;
            const { bins, ...item } = element;

            const binPromises = bins.map(async (bin) => {
              const binPosition = await Bins.findOne({ where: { binID: bin.binID } });
              const position = await Positions.findOne({ where: { positionID: binPosition.positionID } })
              console.log(binPosition);
              console.log(position);
              item.binID = bin.binID;
              item.rackID = bin.rackID;
              item.totalQuantity = bin.quantity;
              item.positionName = position.positionName;
              console.log(item.totalQuantity);
              return await AddItems.create(item, { transaction: t });
            });
            return Promise.all(binPromises);
          });
          await Promise.all(promises);
          io.emit("newTask", { task });
          console.log("its ok")
          res.status(201).json({ error: false, message: "Task Created Successfully" })
        })
      } catch (error) {
        res.status(500).json({ error: true, message: `Task failed:${error.message}` })
      }
    } else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }


  },
  addBinTask: async (req, res) => {
    const { supervisorID, bins } = req.body;
    if (supervisorID && bins) {
      try {
        const currentDate = new Date();
        // console.log(currentDate)
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'addBin', createdAT: currentDate, }, { transaction: t });
          bins.forEach(element => {
            element.taskID = task.taskID
          });
          const addBin = await AddBins.bulkCreate(bins, { transaction: t });
          io.emit('newTask', { task })
          res.status(201).json({ error: false, message: "Task Created Successfully" })
        })
      } catch (error) {
        res.status(500).json({ error: true, message: `Task failed:${error.message}` })
      }

    }
    else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }
  },
  serveItemTask: async (req, res) => {
    const { supervisorID, items } = req.body;
    console.log(items);
    if (supervisorID && items) {
      try {
        const currentDate = new Date();
        sequelize.transaction(async (t) => {
          const task = await Tasks.create({ supervisorID: supervisorID, taskType: 'serveItem', createdAT: currentDate, }, { transaction: t });
          await Promise.all(items.map(async element => {
            element.taskID = task.taskID;
            const bin = await Bins.findOne({ where: { binID: element.binID } }, { transaction: t })

            const position = await Positions.findOne({ where: { positionID: bin.positionID } }, { transaction: t })
            element.position = position.positionName;
            const serveItem = await ServeItems.create(element, { transaction: t });
          }));


          io.emit('newTask', { task })
          res.status(201).json({ error: false, message: "Order Created Successfully" })
        })
      } catch (error) {
        res.status(500).json({ error: true, message: `Task failed:${error.message}` })
      }
    } else {
      res.status(400).json({ error: true, message: "Please provide supervisor ID and task details" })
    }
  },
  transferItemTask: async (req, res) => {

  },
  transferBinTask: async (req, res) => {

  },

  getTask: async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    if (id) {
      try {
        let tasks;
        const user = await Users.findOne({ where: { id: id } })
        console.log(user.role);
        if (user.role === "supervisor") {
          // console.log(user.role);
          tasks = await Tasks.findAll({ where: { supervisorID: id } });
        }
        else {
          tasks = await Tasks.findAll({ where: { operatorID: { [Op.or]: [id, null] } } });
        }
        // const taskList = [];

        //console.log(tasks);
        const taskList = await Promise.all(tasks.map(async (task) => {
          let details;
          //const operator = await Users.findOne({ where: { id: task.operatorID } })
          switch (task.taskType) {
            case "serveItem":
              details = await ServeItems.findAll({ where: { taskID: task.taskID } });
              break;
            case "addItem":
              details = await AddItems.findAll({ where: { taskID: task.taskID } });
              break;
            case "addBin":
              details = await AddBins.findAll({ where: { taskID: task.taskID } });
              break;
            case "transferBin":
              details = await TransferBin.findAll({ where: { taskID: task.taskID } });
              break;
            case "transferItem":
              details = await TransferItem.findAll({ where: { taskID: task.taskID } });
              break;
          }
          if (details) {
            return { task, details }

          };
        }))

        res.status(200).json({ error: false, taskList });
      } catch (error) {
        res.status(500).json({ error: true, message: `Operation failed:${error.message}` })
      }
    } else {
      res.status(400).json({ error: true, message: "Please provide ID " })
    }

  },
  hardware: async (req, res) => {
    console.log("Hardware connected")
    res.status(200).json({ message: "All ok from here" });
  }

}