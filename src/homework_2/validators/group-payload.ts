import Joi = require("@hapi/joi");
import { Permission } from "../interface";
export const payloadGroupValidationSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	permission: Joi.array().required()
});
