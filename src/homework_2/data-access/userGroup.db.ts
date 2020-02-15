import { Model } from "sequelize";
const Sequelize = require("sequelize");

export class UserGroupDB extends Model { }
export const sequelize = new Sequelize();

UserGroupDB.init({
	group_id: {
		primaryKey: true,
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
	},
	users_id: {
		primaryKey: true,
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
	}
}, {
	sequelize,
	modelName: "usergroup"
});
