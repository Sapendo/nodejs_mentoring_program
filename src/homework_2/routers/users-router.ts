import express, { NextFunction, Request, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserPayloadSchema } from "../interface";
import { UsersService } from "../services/users-service";
import { payloadValidationSchema } from "../validators/user-payload";

const usersService: any = new UsersService();
const router = express.Router();
const validator = createValidator();

router.param("id", (req: Request, res: Response, next: NextFunction, id: string) => {
	if (usersService.isUserFound(id)) {
		next();
	} else {
		res.status(400).json({msg: `The user with id-${id} was not found`});
	}
});
router.param("id", (req: Request, res: Response, next: NextFunction, id: string) => {
	if (usersService.isUserDeleted(id)) {
		next();
	} else {
		res.status(400).json({msg: `The user with id-${id} was deleted before`});
	}
});

router.get("/", (req: Request, res: Response) => {
	res.send(usersService.getAutoSuggestUsers(req.query));
});

router.post(
	"/user",
	validator.body(payloadValidationSchema),
	(req: ValidatedRequest<UserPayloadSchema>, res: Response) => {
	const id: string = usersService.addUser(req.body);
	res.send({id});
});

router.route("/user/:id")
	.get((req: Request, res: Response) => {
		res.json(usersService.getUser(req.params.id));
	})
	.put(validator.body(payloadValidationSchema), (req: ValidatedRequest<UserPayloadSchema>, res: Response) => {
		usersService.updateUser(req.params.id, req.body);
		res.json({msg: `The user with id-${req.params.id} was updated`});
	})
	.delete((req: Request, res: Response) => {
		usersService.deleteUser(req.params.id);
		res.status(204).json({msg: `The user with id-${req.params.id} was deleted`});
	});

export { router };
