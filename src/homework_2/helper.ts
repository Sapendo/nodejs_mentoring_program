import { User } from "./interface";

function sortUser(a: User, b: User) {
	if (a.login.toLowerCase() > b.login.toLowerCase()) {
	  return 1;
	}
	if (a.login.toLowerCase() < b.login.toLowerCase()) {
	  return -1;
	}
	return 0;
  }

function filterUserByLogin(users: User[], loginSub: string) {
	return users.filter((user: User) => {
		const login: string = user.login.toLowerCase();
		const loginSubstring: string = loginSub.toLowerCase();
		return ( login.includes(loginSubstring) && !user.isDeleted);
	});
}
export {sortUser, filterUserByLogin};
