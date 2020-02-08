import uuid from "uuid";
import { GroupDB, sequelize } from "../data-access/group.db";
import { UserDB } from "../data-access/user.db";
import { Group, GroupPayload, User } from "../interface";

export class GroupsService {

	public async isGroupFound(id: string): Promise<boolean> {
		const { dataValues: group }: any = await GroupDB.findByPk(id);
		return Boolean(group);
	}

	public async addGroup(payload: GroupPayload): Promise<string> {
		const result: Group = await GroupDB.create({
				id: uuid.v4(),
				name: payload.name,
				permission: payload.permission
			});
		return result.id;
	}

	public async getGroup(id: string): Promise<Group> {
		const group: Group = await this.findGroup(id);
		return group;
	}
	public updateGroup(id: string, payload: GroupPayload) {
		GroupDB.update(payload, { where: { id } });
	}

	public async deleteGroup(id: string) {
		const group: any = await GroupDB.findByPk(id);
		group.destroy();
	}

	public async getGroups() {
		const groups: any = await GroupDB.findAll();
		return groups.get({ plain: true });
	}

	public async addUsersToGroup(id: string, payload: string[]) {
		const users: User[] = [];
		await sequelize.transaction(async (t: any) => {
			const group = await  GroupDB.findByPk(id, { transaction: t });
			payload.forEach((userId: string) => {
				users.push(UserDB.findByPk(userId, { transaction: t }));
			});
			GroupDB.update(users, {where: {...group.id}});
		});
	}

	private async findGroup(id: string): Promise<Group> {
		const group: any = await GroupDB.findByPk(id);
		return group.get({ plain: true });
	}
}
