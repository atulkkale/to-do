//Third Party Modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenvFlow = require('dotenv-flow');

dotenvFlow.config();
console.log(' Current Environment ===>', process.env.NODE_ENV);

//Local Modules
const routes = require('./src/routes/routes');

const app = express();

/* Configuring port */
app.set('port', process.env.PORT || 8000);

/* Importing database connection */
require('./src/config/dbConfig');

/* Parsing Request Limits */
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
