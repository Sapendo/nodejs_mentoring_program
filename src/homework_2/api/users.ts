import Joi from "@hapi/joi";
import express, { Request } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import uuid from "uuid";
import { users } from "../db";
import { filterUserByLogin, sortUser } from "../helper";
import { ExpandedRequest, User, UserPayloadSchema } from "../interface";

const router = express.Router();
const validator = createValidator();
const querySchema: Joi.ObjectSchema = Joi.object({
	login: Joi.string().required(),
	password: Joi.string().regex(/[a-zA-Z]+[0-9]+/).required(),
	age: Joi.number().integer().min(4).max(130).required()
});

router.param("id", (req: ExpandedRequest, res, next, id) => {
	const userIndex: number = users.findIndex((user: User) => user.id === id);
	if (userIndex !== -1  && users[userIndex].isDeleted) {
		res.status(400).json({msg: `The user with id-${id} was deleted before`});
		return;
	} else if (userIndex === -1) {
		res.status(400).json({msg: `The user with id-${id} was not found`});
		return;
	} else {
		req.userIndex = userIndex;
	}
	next();
});

router.get("/", (req: Request, res) => {
	const {limit, filterBy} = req.query;
	const filteredUsers = filterBy ? filterUserByLogin(users, filterBy) : [];
	const sortedUsers: User[] = Boolean(filteredUsers.length) ? filteredUsers.sort(sortUser) : [];
	res.send(sortedUsers.slice(0, limit));
});

router.post("/user", validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
	const user: User = {
		id: uuid.v4(),
		login: req.body.login,
		password: req.body.password,
		age: req.body.age,
		isDeleted: false
	};
	users.push(user);
	res.send({id: user.id});
});

router.route("/user/:id")
	.get((req: ExpandedRequest, res) => {
		res.json(users[req.userIndex!]);
	})
	.put(validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
		const id: string = req.params.id;
		const updateUser = req.body;
		users.find((user: User) => {
			if (user.id === id) {
				user = Object.assign(user, updateUser);
			}
		});
		res.json({msg: `The user with id-${id} was updated`});
	})
	.delete((req: ExpandedRequest, res) => {
		users[req.userIndex!].isDeleted = true;
		res.status(204).json({msg: `The user with id-${req.params.id} was deleted`});
	});

export { router };

