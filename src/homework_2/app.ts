import express, { Request, Response } from "express";
import { createWriteStream } from "fs";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import path from "path";
import User from "./data-access/user";
import { groupRouter } from "./routers/groups-router";
import { userRouter } from "./routers/users-router";
import { UsersService } from "./services/users-service";

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

app.post("/api/login", async (req: any, res: Response) => {
	const usersService: any = new UsersService();
	const userId: string = await usersService.login(req.body);
	if (userId) {
		jwt.sign({userId, login: req.body.login}, "privatekey", { expiresIn: "1h" }, (err, token) => {
			if (err) {
				console.log(err);
			}
			res.send(token);
		});
	} else {
		res.status(403).json({msg: `The login or password was incorrect.`});
		return;
	}
});

app.use((req: any, res, next) => {
	const header = req.headers.authorization;
	if (typeof header !== "undefined") {
		const token = header.split(" ")[1];
		req.token = token;
	} else {
		res.status(401).json({msg: `Please authorize`});
		return;
	}

	jwt.verify(req.token, "privatekey", (err: any, authorizedData: any) => {
		if (err) {
			res.status(403).json({msg: `The token is incorrect`});
			return;
		}
		next();
	});
});
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
