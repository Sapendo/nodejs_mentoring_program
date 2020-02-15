import { BelongsToMany, Column, DataType, Model, PrimaryKey, Scopes, Table } from "sequelize-typescript";
import Group from "./group";
import UserGroup from "./userGroup";

@Scopes(() => ({
	groups: {
	  include: [
		{
		  model: Group,
		  through: {attributes: []},
		},
	  ],
	},
  }))

@Table({
	timestamps: false
  })
export default class User extends Model<User> {
	@BelongsToMany(() => Group, () => UserGroup)
	groups: Group[];

	@PrimaryKey
	@Column(DataType.UUID)
	id: string;

	@Column(DataType.STRING)
	login: string;

	@Column(DataType.STRING)
	password: string;

	@Column(DataType.INTEGER)
	age: number;

	@Column(DataType.BOOLEAN)
	isDeleted: boolean;
}
