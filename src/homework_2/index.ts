import express from "express";
import {router} from "./api/users";

const PORT: string = process.env.dev || "3000";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/api/users", router);

app.listen(PORT, () => console.log("Server start"));
