import express, { NextFunction, Request, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { GroupPayloadSchema } from "../interface";
import { GroupsService } from "../services/groups-service";
import { payloadGroupValidationSchema } from "../validators/group-payload";

const groupService: any = new GroupsService();
const router = express.Router();
const validator = createValidator();

router.param("id", async (req: Request, res: Response, next: NextFunction, id: string) => {
	if ( await groupService.isGroupFound(id)) {
		next();
	} else {
		res.status(400).json({msg: `The group with id-${id} was not found`});
	}
});

router.get("/", async (req: Request, res) => {
	res.send(await groupService.getGroups());
});

router.post(
	"/group",
	validator.body(payloadGroupValidationSchema),
	async (req: ValidatedRequest<GroupPayloadSchema>, res: Response) => {
	const id: string = await groupService.addGroup(req.body);
	res.send({id});
});

router.post(
	"/users-to-group/:id",
	async (req: Request, res: Response) => {
		try {
			await groupService.addUsersToGroup(req.params.id, req.body.userIds);
			res.json({msg: `The users was added to group`});
		} catch (error) {
			res.status(404).json({msg: error.message});
		}
});

router.route("/group/:id")
	.get(async (req: Request, res: Response) => {
		const group: any = await groupService.getGroup(req.params.id);
		res.json(group);
	})
	.put(validator.body(payloadGroupValidationSchema), (req: ValidatedRequest<GroupPayloadSchema>, res: Response) => {
		groupService.updateGroup(req.params.id, req.body);
		res.json({msg: `The group with id-${req.params.id} was updated`});
	})
	.delete((req: Request, res: Response) => {
		groupService.deleteGroup(req.params.id);
		res.status(204).json({msg: `The group with id-${req.params.id} was deleted`});
	});

export { router as groupRouter };
