import { Op } from "sequelize";
import uuid from "uuid";
import { UserDB } from "../data-access/user.db";
import { User, UserPayload } from "../interface";

export class UsersService {

	public async isUserFound(id: string): Promise<boolean> {
		const { dataValues: user }: any = await UserDB.findByPk(id);
		return Boolean(user);
	}
	public async isUserDeleted(id: string): Promise<boolean> {
		const user: User = await this.findUser(id);
		return user && !user.isDeleted;
	}

	public async addUser(payload: UserPayload): Promise<string> {
		const result: User = await UserDB.create({
				id: uuid.v4(),
				login: payload.login,
				password: payload.password,
				age: payload.age,
				isDeleted: false
			});
		return result.id;
	}

	public async getUser(id: string): Promise<User> {
		const user: User = await this.findUser(id);
		return user;
	}
	public updateUser(id: string, payload: UserPayload) {
		UserDB.update(payload, { where: { id } });
	}

	public async deleteUser(id: string) {
		const user: User = await this.findUser(id);
		const deletedUser: User = { ...user, isDeleted: true };
		this.updateUser(id, deletedUser);
	}

	public async getAutoSuggestUsers(query: any) {
		if (Boolean(query.filterBy)) {
			const foundUsers: User[] = await UserDB.findAll({
				where: {
					login: {
						[Op.substring]: query.filterBy
					}
				},
				order: [
					["login", "asc"],
				],
				limit: query.limit,
				raw: true
			});
			return foundUsers;
		}
		return [];
	}

	private async findUser(id: string): Promise<User> {
		const user: any = await UserDB.findByPk(id);
		return user.get({ plain: true });
	}
}
