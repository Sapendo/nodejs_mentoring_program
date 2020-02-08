import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export type Permission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export interface User extends UserPayload {
	id: string;
	isDeleted: boolean;
}

export interface UserPayload {
	login: string;
	password: string;
	age: number;

}
export interface Group extends GroupPayload {
	id: string;
}

export interface GroupPayload {
	name: string;
	permission: Permission[];
}

export interface UserPayloadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: UserPayload;
}
export interface GroupPayloadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: GroupPayload;
}
