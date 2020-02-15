import { BelongsToMany, Column, DataType, ForeignKey, Model, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import { Permission } from "../interface";
import User from "./user";
import UserGroup from "./userGroup";

@Scopes(() => ({
	users: {
	  include: [
		{
		  model: User,
		  through: {attributes: []},
		},
	  ],
	},
  }))
@Table({
	timestamps: false
})
export default class Group extends Model<Group> {
	@BelongsToMany(() => User, () => UserGroup)
	users: User[];

	@ForeignKey(() => UserGroup)
	@PrimaryKey
	@Column(DataType.UUID)
	id: string;

	@Column(DataType.STRING)
	name: string;

	@Column(DataType.ARRAY(DataType.STRING))
	permissions: Permission[];
}
