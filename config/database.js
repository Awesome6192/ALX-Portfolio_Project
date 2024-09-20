// Import the Sequelize constructor from the sequelize package
const { Sequelize } = require('sequelize');

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Configure the database connection using Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,        // Database name from environment variables
    process.env.DB_USER,        // Database username from environment variables
    process.env.DB_PASSWORD,    // Database password from environment variables
    {
        host: process.env.DB_HOST,    // Hostname of the database server from environment variables
        dialect: 'mysql',             // Dialect for the database (MySQL in this case)
        logging: false,               // Disable logging of SQL queries to the console
    }
);

// Test the connection to the database
sequelize.authenticate()
    .then(() => {
        // Log a success message if the connection is established
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        // Log an error message if the connection fails
        console.error('Unable to connect to the database:', err);
    });

// Export the sequelize instance for use in other modules
module.exports = sequelize;