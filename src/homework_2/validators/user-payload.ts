import Joi = require("@hapi/joi");

export const payloadValidationSchema: Joi.ObjectSchema = Joi.object({
	login: Joi.string().required(),
	password: Joi.string().regex(/[a-zA-Z]+[0-9]+/).required(),
	age: Joi.number().integer().min(4).max(130).required()
});
