import { Model } from "sequelize";
const Sequelize = require("sequelize");

export class UserDB extends Model { }
export const sequelize = new Sequelize("postgres://iszdjnzr:PrDCRd2zkx5KxEyrCixR8Ki26X6j-Ht4@manny.db.elephantsql.com:5432/iszdjnzr");

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
