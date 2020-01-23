import uuid from "uuid";
import { users } from "../db";
import { filterUserByLogin, sortUser } from "../helper";
import { User, UserPayload } from "../interface";
import { UserDB } from "../data-access/user.db";

export class UsersService {

	public isUserFound(id: string): User {
		return this.findUser(id);
	}
	public isUserDeleted(id: string): boolean {
		const user: User = this.findUser(id);
		return user && !user.isDeleted;
	}

	public async addUser(payload: UserPayload): Promise<string> {
		let result: User;
		// const user: User = {
		// 	id: uuid.v4(),
		// 	login: payload.login,
		// 	password: payload.password,
		// 	age: payload.age,
		// 	isDeleted: false
		// };
		// users.push(user);
		// return user.id;
		try {
			result = await UserDB.create({
				login: payload.login,
				password: payload.password,
				age: payload.age,
				isDeleted: false
			  });			
		} catch (error) {
			console.log(error)
		}
		return result.id;
	}

	public getUser(id: string): User {
		return this.findUser(id);
	}
	public updateUser(id: string, payload: UserPayload) {
		const user: User = this.findUser(id);
		Object.assign(user, payload);
	}

	public deleteUser(id: string) {
		const user: User = this.findUser(id);
		user.isDeleted = true;
	}

	public getAutoSuggestUsers(query: any) {
		const filteredUsers = query.filterBy ? filterUserByLogin(users, query.filterBy) : [];
		const sortedUsers: User[] = Boolean(filteredUsers.length) ? filteredUsers.sort(sortUser) : [];
		return sortedUsers.slice(0, query.limit);
	}

	private findUser(id: string): User {
		return users.find((user: User) => user.id === id);
	}
}
