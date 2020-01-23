import express from "express";
import { router } from "./routers/users-router";
import { Model } from "sequelize/types";
import { UserDB } from "./data-access/user.db";
const Sequelize = require('sequelize');

const PORT: string = process.env.dev || "3000";

const app = express();

export const sequelize = new Sequelize('user-database-pg', 'sapendo', '123456', {
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});

UserDB.init({
    id: Sequelize.UUIDV4,
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    age: Sequelize.INTEGER,
    isDeleted: Sequelize.BOOLEAN
}, {
    sequelize,
    modelName: "user"
});

sequelize.sync().then((result: any) => console.log(result))
    .catch((err: any) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", router);

app.listen(PORT, () => console.log("Server start"));
