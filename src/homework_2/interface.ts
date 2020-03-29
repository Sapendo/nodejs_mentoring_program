import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export type Permission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export interface IUser extends IUserPayload {
	id: string;
	isDeleted: boolean;
}

export interface IUserPayload {
	login: string;
	password: string;
	age?: number;

}
export interface IGroup extends IGroupPayload {
	id: string;
}

export interface IGroupPayload {
	name: string;
	permission: Permission[];
}

export interface UserPayloadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: IUserPayload;
}
export interface GroupPayloadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: IGroupPayload;
}
