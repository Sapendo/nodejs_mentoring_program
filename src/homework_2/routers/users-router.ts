import express, { NextFunction, Request, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { UserPayloadSchema } from "../interface";
import { UsersService } from "../services/users-service";
import { payloadValidationSchema } from "../validators/user-payload";

const usersService: any = new UsersService();
const router = express.Router();
const validator = createValidator();

router.param("id", async (req: Request, res: Response, next: NextFunction, id: string) => {
	if ( await usersService.isUserFound(id)) {
		next();
	} else {
		res.status(400).json({msg: `The user with id-${id} was not found`});
	}
});

router.param("id", async (req: Request, res: Response, next: NextFunction, id: string) => {
	if (await usersService.isUserDeleted(id)) {
		next();
	} else {
		res.status(400).json({msg: `The user with id-${id} was deleted before`});
	}
});

router.get("/", async (req: Request, res) => {
	res.send(await usersService.getAutoSuggestUsers(req.query));
});

router.post(
	"/user",
	validator.body(payloadValidationSchema),
	async (req: ValidatedRequest<UserPayloadSchema>, res: Response) => {
	const id: string = await usersService.addUser(req.body);
	res.send({id});
});

router.route("/user/:id")
	.get(async (req: Request, res: Response) => {
		const user: any = await usersService.getUser(req.params.id);
		res.json(user);
	})
	.put(validator.body(payloadValidationSchema), (req: ValidatedRequest<UserPayloadSchema>, res: Response) => {
		usersService.updateUser(req.params.id, req.body);
		res.json({msg: `The user with id-${req.params.id} was updated`});
	})
	.delete((req: Request, res: Response) => {
		usersService.deleteUser(req.params.id);
		res.status(204).json({msg: `The user with id-${req.params.id} was deleted`});
	});

export { router as userRouter };
