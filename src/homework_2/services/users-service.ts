import uuid from "uuid";
import { users } from "../db";
import { filterUserByLogin, sortUser } from "../helper";
import { User, UserPayload } from "../interface";

export class UsersService {

	addUser(payload: UserPayload): string {
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
    updateUser(id: string, payload: UserPayload) {
        users.find((user: User) => {
			if (user.id === id) {
				Object.assign(user, payload);
			}
		});
	}
	
	deleteUser(index: number) {
		users[index].isDeleted = true;
	}

	getAutoSuggestUsers(query: any) {
		const filteredUsers = query.filterBy ? filterUserByLogin(users, query.filterBy) : [];
		const sortedUsers: User[] = Boolean(filteredUsers.length) ? filteredUsers.sort(sortUser) : [];
		return sortedUsers.slice(0, query.limit);
	}
}