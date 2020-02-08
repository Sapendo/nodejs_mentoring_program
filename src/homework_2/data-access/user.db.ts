import { Model } from "sequelize";
import { GroupDB } from "./group.db";
import { UserGroupDB } from "./userGroup.db";
const Sequelize = require("sequelize");

export class UserDB extends Model { }
export const sequelize = new Sequelize();

UserDB.init({
	id: {
		primaryKey: true,
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
	},
	login: Sequelize.STRING,
	password: Sequelize.STRING,
	age: Sequelize.INTEGER,
	isDeleted: Sequelize.BOOLEAN
}, {
	sequelize,
	modelName: "user"
});

UserDB.belongsToMany(GroupDB, {through: UserGroupDB});