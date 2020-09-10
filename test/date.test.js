const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");
let clientToken, stylistId, anotherClientId;
beforeEach(async (done) => {
  await connectToTestDb();

  const clientRaw = generateFakeUser("client");
  const anotherclient = generateFakeUser("client");
  const stylistRaw = generateFakeUser("stylist");

  await request.post("/auth/register").send(clientRaw);
  const anotherClientRegister = await request
    .post("/auth/register")
    .send(anotherclient);
  const stylistRegister = await request.post("/auth/register").send(stylistRaw);
  stylistId = stylistRegister.body._id;
  anotherClientId = anotherClientRegister.body._id;

  const clientLogin = await request.post("/auth/login").send({
    email: clientRaw.email,
    password: clientRaw.password,
  });
  // const stylistLogin = await request.post("/auth/login").send({
  //   email: stylistRaw.email,
  //   password: stylistRaw.password,
  // });

  // stylistToken = stylistLogin.body.token;
  clientToken = clientLogin.body.token;

  return done();
});

afterEach((done) => dropDatabase(done));

describe("POST /user/:id/date", () => {
  it("Must return 201 when all is ok", async () => {
    const response = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    expect(response.status).toBe(201);
  });

  it("Must return 400 if user is not an stylist", async () => {
    const response = await request
      .post(`/user/${anotherClientId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    expect(response.status).toBe(400);
  });

  it("Must return 400 when the selected date is not vacant", async () => {
    await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const response = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    expect(response.status).toBe(400);
  });
});

describe("GET /user/:id/date", () => {
  it("Must return 403 if the selected user is not an stylist or self user", async () => {
    const response = await request
      .get(`/user/${anotherClientId}/date`)
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(403);
  });
});
