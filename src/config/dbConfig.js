if (process.env.DATABASE_DRIVER === 'mongodb') {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.DB_URI, {
    config: {
      autoIndex: false,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // DB connection
  const db = mongoose.connection;

  db.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.DB_URI);
  });

  db.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });

  db.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  process.on('SIGINT', () => {
    db.close();
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });

  //Exported the database connection to be imported at the server
  module.exports = db;
} else {
  console.log(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
}
