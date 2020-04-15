import { sequelize } from "../sequelize";
import { UsersService } from "./users-service";

const usersService = new UsersService();

beforeAll(async () => {
	await sequelize.sync();
  });

afterAll(async (done) => {
	sequelize.close();
	done();
  });

describe("Users API", () => {
	let userId: string;
	const createPayload = {
		login: "Test",
		password: "test123",
		age: 30
	};
	const savePayload = {
		login: "Tset",
		password: "321tset",
		age: 3
	};

	it("should create user", async () => {
		userId = await usersService.addUser(createPayload);
		expect(userId).toBeDefined();
	});

	it("should find the user by id", async () => {
		const isUserFound = await usersService.isUserFound(userId);
		expect(isUserFound).toBeTruthy();
	});

	it("should return that vuser is not deleted", async () => {
		const isUserDeleted = await usersService.isUserDeleted(userId);
		expect(isUserDeleted).toBeTruthy();
	});

	it("should return user", async () => {
		const user = await usersService.getUser(userId);
		expect(user).toStrictEqual({
			id: userId,
			isDeleted: false,
			login: "Test",
			password: "test123",
			age: 30
		});
	});

	it("should update user", async () => {
		await usersService.updateUser(userId, savePayload);
		const user = await usersService.getUser(userId);
		expect(user).toStrictEqual({
			id: userId,
			isDeleted: false,
			...savePayload
		});
	});

	it("should delete user", async () => {
		await usersService.deleteUser(userId);
		const user = await usersService.getUser(userId);
		expect(user).toStrictEqual({
			id: userId,
			isDeleted: true,
			...savePayload
		});
	});

});
