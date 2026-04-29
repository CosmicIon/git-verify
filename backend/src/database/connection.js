const { Sequelize } = require("sequelize");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASS || "Harsh@8118198";
const DB_NAME = process.env.DB_NAME || "gitverify";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log(
      JSON.stringify({
        component: "database",
        event: "connected",
        uri: `mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      })
    );
  } catch (error) {
    if (error.name === 'SequelizeConnectionError' && error.original && error.original.code === 'ER_BAD_DB_ERROR') {
      const mysql = require('mysql2/promise');
      try {
        const connection = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log(
          JSON.stringify({
            component: "database",
            event: "connected",
            uri: `mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
          })
        );
        return;
      } catch (innerError) {
        console.warn(JSON.stringify({ component: "database", event: "connection_failed", message: innerError.message }));
      }
    }
    console.warn(
      JSON.stringify({
        component: "database",
        event: "connection_failed",
        message: error.message,
      })
    );
  }
}

function isDatabaseReady() {
  return true;
}

module.exports = {
  sequelize,
  connectDatabase,
  isDatabaseReady,
};
