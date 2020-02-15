import {Sequelize} from "sequelize-typescript";
export const sequelize = new Sequelize({
  host: "localhost",
  database: "users",
  dialect: "postgres",
  port: 3000,
  models: [__dirname + "/data-access"]
});
