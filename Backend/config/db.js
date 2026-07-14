const knex = require("knex");
const knexConfig = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

console.log(`📊 Database environment: ${environment}`);
console.log(`📊 Database: ${knexConfig[environment].connection.database}`);

module.exports = db;
