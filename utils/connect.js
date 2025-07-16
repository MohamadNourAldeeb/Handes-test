import mysql2 from "mysql2";
import { Sequelize } from "sequelize";

const initialSequelize = new Sequelize(
  "",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectModule: mysql2,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    logging: false,
  }
);

async function initializeDatabase() {
  try {
    const [results] = await initialSequelize.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (results.length === 0) {
      console.log(`Database ${process.env.DB_NAME} not found, creating it...`);
      await initialSequelize.query(
        `CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
      );
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    }

    await initialSequelize.close();
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

await initializeDatabase();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectModule: mysql2,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
    logging: false,
    timezone: "+03:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: (field, next) => {
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
  }
);
