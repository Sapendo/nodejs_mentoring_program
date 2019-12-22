import Joi from "@hapi/joi";
import express, { Request } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { users } from "../db";
import { ExpandedRequest, User, UserPayloadSchema } from "../interface";
import { UsersService } from "../services/users-service";

const usersService: any = new UsersService();
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
	res.send(usersService.getAutoSuggestUsers(req.query));
});

router.post("/user", validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
	const id: string = usersService.addUser(req.body);
	res.send({id: id});
});

router.route("/user/:id")
	.get((req: ExpandedRequest, res) => {
		res.json(users[req.userIndex!]);
	})
	.put(validator.body(querySchema), (req: ValidatedRequest<UserPayloadSchema>, res) => {
		usersService.updateUser(req.params.id, req.body);
		res.json({msg: `The user with id-${req.params.id} was updated`});
	})
	.delete((req: ExpandedRequest, res) => {
		usersService.deleteUser(req.userIndex);
		res.status(204).json({msg: `The user with id-${req.params.id} was deleted`});
	});

export { router };

