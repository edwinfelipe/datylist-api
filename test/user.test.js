const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");

let token;
beforeEach(async (done) => {
  await connectToTestDb();

  const clientRaw = generateFakeUser("client");

  await request.post("/auth/register").send(clientRaw);

  const clientLogin = await request.post("/auth/login").send({
    email: clientRaw.email,
    password: clientRaw.password,
  });

  token = clientLogin.body.token;
  return done();
});

afterEach((done) => dropDatabase(done));

describe("PUT /user/", () => {
  it("Must return 200 when all is ok", async () => {
    const response = await request
      .put("/user")
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: "Roberto",
        lastName: "Angel",
      });
    expect(response.status).toBe(200);
  });

  it("Must return 400 on invalid data", async () => {
    const response = await request
      .put("/user")
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: "R",
        lastName: "Angel",
      });
    expect(response.status).toBe(400);
  });
});

describe("GET /user", () => {
  it("must return 200 when all is ok", async () => {
    const response = await request
      .get("/user")
      .set({ authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
  });
});
