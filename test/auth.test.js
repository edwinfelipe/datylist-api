const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
beforeEach((done) => {
  connectToTestDb().then(() => done());
});

afterEach((done) => dropDatabase(done));

describe("POST /auth/register", () => {
  it("should return 404", async () => {
    const nothing = await request.get("/");
    
    expect(nothing.status).toBe(404);
  });
});
