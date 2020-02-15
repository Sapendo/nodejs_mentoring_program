import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Group from "./group";
import User from "./user";

@Table({
	timestamps: false
  })
export default class UserGroup extends Model<UserGroup> {
	@ForeignKey(() => Group)
	@Column(DataType.STRING)
	groupId: string;

	@ForeignKey(() => User)
	@Column(DataType.STRING)
	userId: string;
}
