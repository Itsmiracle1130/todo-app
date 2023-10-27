/* eslint-disable no-undef */
const supertest = require("supertest");
const mongoose = require("mongoose");
const createServer = require("../utility/server.js");
const { todo1, todo2, todo3, todo4, todo5 } = require("./testData/task.js");
const { loginAndSetToken } = require("./setup.js");

const request = supertest(createServer());

describe("todo endpoint", () => {

	beforeAll( async() => {
		await mongoose.connect(process.env.DATABASE_URL);
	}, 10000);

	afterAll(async() => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	}, 10000);

	describe("Unauthentiicated todo Endpoint", () => {
		it("should return 403", async() => {
			const { status } = await request.post("/tasks/").send(todo1);

			expect(status).toBe(403);
		});
	});
	describe("todo Creation", () => {
		it("should create todo", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/tasks/").send(todo1).set("Cookie", `token=${token}`);

			expect(status).toBe(201);
		});

		describe("todo creation with incomplete details", () => {
			it("should return 400", async() => {
				const token = await loginAndSetToken();
				await request.post("/tasks/").send(todo2).expect(400).set("Cookie", `token=${token}`);

			});
		});
	});

	describe("Read tasks", () => {
		it("should read all pending tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks/").set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});

		it("should read all pending tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks?status=pending").set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
        
		it("should read all completed tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks?status=completed").set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
        
		it("should read all deleted tasks", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/tasks?status=deleted").set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
	});
	describe("Read a particular todo", () => {
		it("should return 200", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(todo3).set("Cookie", `token=${token}`);
          
			const todoId = createResponse.body.data._id;
          
			const { status } = await request.get(`/tasks/${todoId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});
    
	describe("Update a todo", () => {
		it("should return 200", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(todo4).set("Cookie", `token=${token}`);
          
			const todoId = createResponse.body.data._id;

			const { status } = await request.patch(`/tasks/${todoId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});
    
	describe("Delete a todo", () => {
		it("should return 204", async() => {
			const token = await loginAndSetToken();
			const createResponse = await request.post("/tasks").send(todo5).set("Cookie", `token=${token}`);
          
			const todoId = createResponse.body.data._id;

			const { status } = await request.delete(`/tasks/${todoId}`).set("Cookie", `token=${token}`);

			expect(status).toBe(204);
		});
	});
});