import { Model } from "sequelize";
import { UserDB } from "./user.db";
import { UserGroupDB } from "./userGroup.db";
const Sequelize = require("sequelize");

export class GroupDB extends Model { }
export const sequelize = new Sequelize();

GroupDB.init({
	id: {
		primaryKey: true,
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
	},
	name: Sequelize.STRING,
	permissions: Sequelize.STRING
}, {
	sequelize,
	modelName: "groups"
});

GroupDB.belongsToMany(UserDB, {through: UserGroupDB});
