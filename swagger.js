import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'SmartBox API',
        description: 'Description'
    },
    host: '192.168.0.100:6000'

};

const outputFile = './swagger-output.json';
const routes = ['./routes/add.component.routes.js','./routes/auth.routes.js', './routes/get.data.routes.js', './routes/remove.component.routes.js',  './routes/task.routes.js', './routes/transfer.component.routes.js',]
//'./routes/search.routes.js',
swaggerAutogen()(outputFile, routes, doc).then(async () => {
    await import('./app.js'); // Your project's root file
  });