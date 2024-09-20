// Import required modules
const fs = require('fs'); // File system module for reading files and directories
const path = require('path'); // Path module for working with file and directory paths
const Sequelize = require('sequelize'); // Sequelize module for ORM functionality
const process = require('process'); // Process module for accessing environment variables

// Get the current filename (this file)
const basename = path.basename(__filename);

// Determine the environment (development, test, production) from the environment variables
const env = process.env.NODE_ENV || 'development';

// Load the database configuration for the current environment
const config = require(__dirname + '/../config/config.js')[env];

// Initialize an empty object to hold the database models
const db = {};

// Create a new Sequelize instance
let sequelize;
if (config.use_env_variable) {
  // If the configuration uses an environment variable for the database URL
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Otherwise, use the configuration parameters directly
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all files in the current directory (excluding the current file and non-JS files)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Exclude hidden files (starting with a dot)
      file !== basename && // Exclude the current file
      file.slice(-3) === '.js' && // Include only JavaScript files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach(file => {
    // Dynamically import each model file and associate it with the Sequelize instance
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Add the model to the db object
  });

// Set up model associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize and Sequelize to the db object for easier access
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models and the Sequelize instance
module.exports = db;