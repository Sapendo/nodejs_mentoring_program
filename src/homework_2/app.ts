import express from "express";
import { groupRouter } from "./routers/groups-router";
import { userRouter } from "./routers/users-router";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
