import { Op } from "sequelize";
import uuid from "uuid";
import User from "../data-access/user";
import { IUser, IUserPayload } from "../interface";

export class UsersService {

	public async isUserFound(id: string): Promise<boolean> {
		const dataValues: any = await User.findByPk(id);
		return Boolean(dataValues);
	}
	public async isUserDeleted(id: string): Promise<boolean> {
		const user: IUser = await this.findUser(id);
		return user && !user.isDeleted;
	}

	public async addUser(payload: IUserPayload): Promise<string> {
		const result: IUser = await User.create({
				id: uuid.v4(),
				login: payload.login,
				password: payload.password,
				age: payload.age,
				isDeleted: false
			});
		return result.id;
	}

	public async getUser(id: string): Promise<IUser> {
		const user: IUser = await this.findUser(id);
		return user;
	}
	public async login(body: any): Promise<boolean> {
		const { login, password } = body;
		const user: IUser[] = await User.findAll({
			where: {
				login,
				password
			}
		  });
		return user.length > 0;
	}
	public updateUser(id: string, payload: IUserPayload) {
		User.update(payload, { where: { id } });
	}

	public async deleteUser(id: string) {
		const user: IUser = await this.findUser(id);
		const deletedUser: IUser = { ...user, isDeleted: true };
		this.updateUser(id, deletedUser);
	}

	public async getAutoSuggestUsers(query: any) {
		if (Boolean(query.filterBy)) {
			const foundUsers: IUser[] = await User.findAll({
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

	private async findUser(id: string): Promise<IUser> {
		const user: any = await User.findByPk(id);
		return user.get({ plain: true });
	}
}
