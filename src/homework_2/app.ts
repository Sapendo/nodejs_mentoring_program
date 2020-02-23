import express, { Request, Response } from "express";
import { createWriteStream } from "fs";
import morgan from "morgan";
import path from "path";
import { groupRouter } from "./routers/groups-router";
import { userRouter } from "./routers/users-router";

const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });
const loggerFormat = ":method :url :status Body - :body :response-time";
morgan.token("body", (req: Request, res: Response) => {
	return JSON.stringify(req.body);
});

process.on("uncaughtException", (err: any) => {
	// tslint:disable-next-line: new-parens
	console.error((new Date).toUTCString() + " uncaughtException:", err.message);
	console.error(err.stack);
	process.exit(1);
  });

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(loggerFormat, {
	skip: (req: Request, res: Response) => res.statusCode < 400,
	stream: accessLogStream
}));
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
