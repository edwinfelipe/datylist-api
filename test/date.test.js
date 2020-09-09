const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");
let clientToken, stylistToken, stylistId;
beforeEach(async (done) => {
  await connectToTestDb();

  const clientRaw = generateFakeUser();
  const stylistRaw = generateFakeUser();

  await request.post("/auth/register").send(clientRaw);
  const stylistRegister = await request.post("/auth/register").send(stylistRaw);
  stylistId = stylistRegister.body._id;

  const clientLogin = await request.post("/auth/login").send({
    email: clientRaw.email,
    password: clientRaw.password,
  });
  const stylistLogin = await request.post("/auth/login").send({
    email: stylistRaw.email,
    password: stylistRaw.password,
  });

  clientToken = clientLogin.body.token;
  stylistToken = stylistLogin.body.token;

  return done();
});

afterEach((done) => dropDatabase(done));

describe("POST /stylist/:id/date", () => {
  it("Must return 201 when all is ok", async () => {
    const response = await request
      .post(`/stylist/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    expect(response.status).toBe(201);
  });

  it("Must return 400 when the selected date is not vacant", async () => {
    await request
      .post(`/stylist/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const response = await request
      .post(`/stylist/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date().toISOString(),
      });

    expect(response.status).toBe(400);
  });
});
