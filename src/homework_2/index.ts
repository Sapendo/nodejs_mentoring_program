import express from "express";
import { sequelize } from "./data-access/user.db";
import { groupRouter } from "./routers/groups-router";
import { userRouter } from "./routers/users-router";

const PORT: string = process.env.dev || "3000";

const app = express();

sequelize.sync().catch((err: any) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);

app.listen(PORT, () => console.log("Server start"));
