import { Transaction } from "sequelize/types";
import uuid from "uuid";
import Group from "../data-access/group";
import User from "../data-access/user";
import UserGroup from "../data-access/userGroup";
import { IGroup, IGroupPayload, IUser } from "../interface";
import { sequelize } from "../sequelize";

export class GroupsService {

	public async isGroupFound(id: string): Promise<boolean> {
		const { dataValues: group }: any = await Group.findByPk(id);
		return Boolean(group);
	}

	public async addGroup(payload: IGroupPayload): Promise<string> {
		const result: IGroup = await Group.create({
				id: uuid.v4(),
				name: payload.name,
				permissions: [...payload.permission]
			});
		return result.id;
	}

	public async getGroup(id: string): Promise<IGroup> {
		const group: IGroup = await this.findGroup(id);
		return group;
	}
	public updateGroup(id: string, payload: IGroupPayload) {
		Group.update({...payload}, { where: { id } });
	}

	public async deleteGroup(id: string): Promise<void> {
		const group: any = await Group.findByPk(id);
		group.destroy();
	}

	public async getGroups(): Promise<IGroup[]> {
		return await Group.findAll();
	}

	public async addUsersToGroup(id: string, payload: string[]): Promise<any> {
		const transaction: Transaction = await sequelize.transaction();
		// tslint:disable-next-line: prefer-for-of
		for (let i: number = 0; i < payload.length; i++) {
			const user: IUser = await User.findByPk(payload[i], { transaction });
			if (!user) {
				throw Error(`The user with id ${payload[i]} is absent in the database.`);
				break;
			}
			await UserGroup.create({
				groupId: id,
				userId: payload[i]
			}, { transaction });
			await transaction.commit();
		}
	}

	private async findGroup(id: string): Promise<IGroup> {
		const group: any = await Group.findByPk(id);
		return group.get({ plain: true });
	}
}
