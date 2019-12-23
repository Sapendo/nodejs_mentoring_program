import uuid from "uuid";
import { users } from "../db";
import { filterUserByLogin, sortUser } from "../helper";
import { User, UserPayload } from "../interface";

export class UsersService {

	public isUserFound(id: string): User {
		return this.findUser(id);
	}
	public isUserDeleted(id: string): boolean {
		const user: User = this.findUser(id);
		return user && !user.isDeleted;
	}

	public addUser(payload: UserPayload): string {
		const user: User = {
			id: uuid.v4(),
			login: payload.login,
			password: payload.password,
			age: payload.age,
			isDeleted: false
		};
		users.push(user);
		return user.id;
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
