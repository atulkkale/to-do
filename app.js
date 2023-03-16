//Third Party Modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenvFlow = require('dotenv-flow');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenvFlow.config();
console.log(' Current Environment ===>', process.env.NODE_ENV);

//Local Modules
const routes = require('./src/routes/routes');

const swaggerOptions = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do App Documentation',
      version: '1.0.0',
      description:
        'This is a To-Do API application made with Express and MonodoDB where user can create and manage their tasks.',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

/* Configuring port */
app.set('port', process.env.PORT || 8000);

/* Importing database connection */
require('./src/config/dbConfig');

/* Parsing Request Limits */
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: '50mb',
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

/* Configuring Routes */
app.use('/api', routes);

/* Swagger api-docs Routes */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* Handling invalid route */
app.use('/', function (req, res) {
  res.status(404).send('Route not found');
});

/**
 * Listening to port
 */
app.listen(app.get('port'), () => {
  console.log(`Find the server at port:${app.get('port')}`);
});
