import Joi from "@hapi/joi";
import express from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import uuid from "uuid";
import { users } from "../db";
import { filterUserByLogin, sortUser } from "../helper";
import { User, UserPayloadSchema } from "../interface";

const router = express.Router();
const validator = createValidator();
const querySchema: Joi.ObjectSchema = Joi.object({
	login: Joi.string().required(),
	password: Joi.string().regex(/[a-zA-Z]+[0-9]+/).required(),
	age: Joi.number().integer().min(4).max(130).required()
});

router.param("id", (req, res, next, id) => {
	const filteredUser: User[] = users.filter((user: User) => user.id === id);
	if (filteredUser.length && filteredUser[0].isDelete) {
		res.status(400).json({msg: `The user with id-${id} was deleted before`});
	} else if (!filteredUser.length) {
		res.status(400).json({msg: `The user with id-${id} was not found`});
	}
	next();
});

router.get("/", (req, res) => {
	const {limit, filterBy} = req.query;
	const filteredUsers = filterBy ? filterUserByLogin(users, filterBy) : [];
	const sortedUsers: User[] | null = Boolean(filteredUsers.length) ? filteredUsers.sort(sortUser) : null;
	if (sortedUsers) {
		res.send(sortedUsers.slice(0, limit));
	} else {
		res.status(400).json({msg: `According to your request users were not found`});
	}
});

router.post("/user", validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
	const user: User = {
		id: uuid.v4(),
		login: req.body.login,
		password: req.body.password,
		age: req.body.age,
		isDelete: false
	};
	users.push(user);
	res.send({id: user.id});
});

router.get("/user/:id", (req, res) => {
	const id: string = req.params.id;
	const userIndex: number = users.findIndex((user: User) => user.id === id);
	res.json(users[userIndex]);
});

router.put("/user/:id", validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
	const id: string = req.params.id;
	const updateUser = req.body;
	users.forEach((user: User) => {
		if (user.id === id) {
			// user = { ...updateUser };
			user.login = updateUser.login;
			user.password = updateUser.password;
			user.age = updateUser.age;
		}
	});
	res.json({msg: `The user with id-${id} was updated`});
});

router.delete("/user/:id", (req, res) => {
	const id: string = req.params.id;
	const userIndex: number = users.findIndex((user: User) => user.id === id);
	users[userIndex].isDelete = true;
	res.status(204).json({msg: `The user with id-${id} was deleted`});
});

export { router };
