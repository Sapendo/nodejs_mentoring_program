import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface User extends UserPayload {
	id: string;
	isDelete: boolean;
}

export interface UserPayload {
	login: string;
	password: string;
	age: number;

}

export interface UserPayloadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: UserPayload;
}
