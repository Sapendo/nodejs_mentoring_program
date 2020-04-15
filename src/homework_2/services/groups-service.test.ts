import { sequelize } from "../sequelize";
import { GroupsService } from "./groups-service";

const groupService = new GroupsService();
let groupId: string;

beforeAll(async () => {
	await sequelize.sync();
  });

afterAll(async (done) => {
	sequelize.close();
	done();
});

describe("Groups API", () => {
	const createPayload = {
		name: "Test",
		permission: ["READ"]
	};
	const savePayload = {
		name: "Tset",
		permission: ["WRITE"]
	};

	it("should create group", async () => {
		groupId = await groupService.addGroup(createPayload);
		expect(groupId).toBeDefined();
		await groupService.deleteGroup(groupId);
	});

	it("should find the group by id", async () => {
		groupId = await groupService.addGroup(createPayload);
		const isGroupFound: boolean = await groupService.isGroupFound(groupId);
		expect(isGroupFound).toBeTruthy();
		await groupService.deleteGroup(groupId);
	});

	it("should return group", async () => {
		groupId = await groupService.addGroup(createPayload);
		const group = await groupService.getGroup(groupId);
		expect(group).toStrictEqual({
			id: groupId,
			name: "Test",
			permissions: ["READ"]
		});
		await groupService.deleteGroup(groupId);
	});

	it("should update group", async () => {
		groupId = await groupService.addGroup(createPayload);
		await groupService.updateGroup(groupId, savePayload);
		const group = await groupService.getGroup(groupId);
		expect(group).toStrictEqual({
			id: groupId,
			...savePayload
		});
		await groupService.deleteGroup(groupId);
	});

	it("should delete group", async () => {
		groupId = await groupService.addGroup(createPayload);
		await groupService.deleteGroup(groupId);
		const isGroupFound: boolean = await groupService.isGroupFound(groupId);
		expect(isGroupFound).toBeFalsy();
	});

});
