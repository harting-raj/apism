import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import sequelize from './config/database.js'
import authRoute from './routes/auth.routes.js'
import addComponentRoute from './routes/add.component.routes.js'
import removeComponentRoute from './routes/remove.component.routes.js'
import transferComponentRoute from './routes/transfer.component.routes.js'
import getHomepageDataRouter from './routes/get.data.routes.js'
import { createServer } from 'node:http';
import { Server } from "socket.io";
import taskRouter from './routes/task.routes.js'
import Tasks from './models/task.model.js'
import { where } from 'sequelize'
import Users from './models/user.model.js'
import searchController from './controllers/search.controller.js'
import authMiddleware from './middleware/auth.middleware.js';



const app = express();
const server = createServer(app)


const io = new Server(server, {
  cors: {
    origin: "*"
  },
  allowEIO3: true // false by default
});

io.on('connection', (socket) => {
  var c = 1;
  console.log('A user connected', (++c));

  socket.on('message', (data) => {
    console.log('Received message:', data);
    // You can broadcast this message to other clients if needed
    // io.emit('message', data);
  });
  socket.on('claim-task', async (data) => {
    // console.log("Hellooooo");
    const { operatorID, taskID } = data;
    console.log(operatorID, taskID);
    const user = await Users.findOne({ where: { id: operatorID } });
    const task = await Tasks.update({ status: 1, operatorID: operatorID, operatorName: user.firstName ?? "" }, { where: { taskID: taskID } })
    console.log(task);
    io.emit("claim-success", "Hii");
  });
  socket.on('hardware-light', async (data) => {
    console.log(data);
    const { status, rackID, positionName, color } = data;
    console.log(status)
    
    if (status == 1) {
      io.emit("locate-light", {
        "status": status,
        "color": color,
        "rackID": rackID,
        "positionName": positionName
      });
    }
    else {
      io.emit("locate-light", {
        "status": status,
        "color": color,
        "rackID": rackID,
        "positionName": positionName
      });
    }

  })
  socket.on('unlock', async (data) => {
   console.log(data);
    const { status, rackID, positionName } = data;
    if (status == 1) {
      io.emit('unlock-position', {
        "status": status,
        "rackID": rackID,
       
        "positionName": positionName
      })

    } else {
      io.emit('unlock-position', {
        "status": status,
        "rackID": rackID,
       
        "positionName": positionName
      })
    }
  });

  socket.on('bin-status-enquiry', async (data) => {
   console.log(data)
    
    const { rackID, positionID, positionName } = data;
    io.emit('bin-status-enquiry', data);
  })
  socket.on('bin-status-info', async (data) => {
    console.log(data);
    /* data={
     "rackID":"r@123",
     "positionName":A1,
     "status":1
    }*/
    io.emit('bin-status-info', data);
  })
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



sequelize.sync({ force: false }).then(() => {
  console.log('Database sunchronized')
}).catch((error) => console.log("Database sync error", error));

dotenv.config();
const port = process.env.PORT || 6000;


// middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // use express.urlencoded()



app.get('/', (req, res) => {
  res.send('Hello from server');
})


//routes
app.use('/auth', authRoute)
app.use('/add', addComponentRoute)
app.use('/remove', removeComponentRoute)
app.use('/transfer', transferComponentRoute)
app.use('/get', getHomepageDataRouter)
app.use('/task', taskRouter)
app.use('/search', authMiddleware.checkUserAuth, searchController.searchComponent)


server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on ${port}`);
})
export { io }