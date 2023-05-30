const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'order',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    console.log('Connected to database');
  }
});

module.exports = connection;
