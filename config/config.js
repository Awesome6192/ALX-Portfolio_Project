// Load environment variables from a .env file into process.env
require('dotenv').config();

// Export the database configuration object
module.exports = {
  development: {
    // Database username from environment variables
    username: process.env.DB_USER,
    // Database password from environment variables
    password: process.env.DB_PASSWORD,
    // Database name from environment variables
    database: process.env.DB_NAME,
    // Database host from environment variables
    host: process.env.DB_HOST,
    // Database dialect specifying the type of database to use (MySQL in this case)
    dialect: 'mysql',
  },
  
  // Configuration for test environment
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  
  // Configuration for production environment
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};