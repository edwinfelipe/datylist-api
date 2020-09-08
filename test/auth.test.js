const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");
beforeEach((done) => {
  connectToTestDb().then(() => done());
});

afterEach((done) => dropDatabase(done));

describe("POST /auth/register", () => {
  it("Must return 400 on invalid data", async () => {
    const user = generateFakeUser();
    user.name = "e";
    user.email = "arandomemail@";
    user.password = "123456";
    const response = await request.post("/auth/register").send(user);

    expect(response.status).toBe(400);
    // expect(response.body.errors).toBeDefined();
  });

  it("Must return 400 when the user already exist", async () => {
    const user = generateFakeUser();

    await request.post("/auth/register").send(user);
    const response = await request.post("/auth/register").send(user);

    expect(response.status).toBe(400);
  });

  it("Must return 201 when all is done and body must not contain password", async () => {
    const user = generateFakeUser();
    const response = await request.post("/auth/register").send(user);
    expect(response.status).toBe(201);
    expect(response.body.password).toBeUndefined();
  });
});

describe("POST /auth/login", () => {
  it("Must return 404 if user does not exist", async () => {
    const { email, password } = generateFakeUser();

    const response = await request.post("/auth/login").send({
      email,
      password,
    });

    expect(response.status).toBe(404);
  });

  it("Must return 400 on invalid password", async () => {
    const user = generateFakeUser();
    await request.post("/auth/register").send(user);

    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "12345678",
    });

    expect(response.status).toBe(400);
  });

  it("Must return 200 and return a token when all is ok", async () => {
    const user = generateFakeUser();
    const { email, password } = user;
    await request.post("/auth/register").send(user);

    const response = await request.post("/auth/login").send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});

describe("GET /auth/me", () => {
  it("Must return 401 when the token is not valid or not present", async () => {
    const user = generateFakeUser();
    const { email, password } = user;
    await request.post("/auth/register").send(user);

    const loginResponse = await request.post("/auth/login").send({
      email,
      password,
    });

    const token = loginResponse.body.token;

    const response = await request
      .get("/auth/me")
      .set({ authorization: `Bearer ${token}1234` });

    expect(response.status).toBe(401);
  });

  it("Must return 200 when the token is valid", async () => {
    const user = generateFakeUser();
    const { email, password } = user;
    await request.post("/auth/register").send(user);

    const loginResponse = await request.post("/auth/login").send({
      email,
      password,
    });

    const token = loginResponse.body.token;

    const response = await request
      .get("/auth/me")
      .set({ authorization: `Bearer ${token}` });
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});
