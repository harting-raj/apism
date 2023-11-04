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
import {Server} from "socket.io";
import taskRouter from './routes/task.routes.js'

const app = express();
const server = createServer(app)


const io= new Server(server);
  
  io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('message', (data) => {
      console.log('Received message:', data);
      // You can broadcast this message to other clients if needed
      // io.emit('message', data);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  


sequelize.sync({ force: false }).then(() => {
    console.log('Database sunchronized')
}).catch((error) => console.log("Database sync error", error));

dotenv.config();
const port = process.env.PORT || 8080;


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


server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on ${port}`);
})
export  {io}