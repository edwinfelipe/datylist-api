const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");
let clientToken, anotherClientToken, stylistId, anotherClientId;
beforeEach(async (done) => {
  await connectToTestDb();

  const clientRaw = generateFakeUser("client");
  const anotherClient = generateFakeUser("client");
  const stylistRaw = generateFakeUser("stylist");

  await request.post("/auth/register").send(clientRaw);
  const anotherClientRegister = await request
    .post("/auth/register")
    .send(anotherClient);
  const stylistRegister = await request.post("/auth/register").send(stylistRaw);
  stylistId = stylistRegister.body._id;
  anotherClientId = anotherClientRegister.body._id;

  const clientLogin = await request.post("/auth/login").send({
    email: clientRaw.email,
    password: clientRaw.password,
  });
  const anotheClientLogin = await request.post("/auth/login").send({
    email: anotherClient.email,
    password: anotherClient.password,
  });

  anotherClientToken = anotheClientLogin.body.token;
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

  it("Must return 200 when all is ok", async () => {
    const response = await request
      .get(`/user/${stylistId}/date`)
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(200);
  });
});

describe("PUT /user/date/:id", () => {
  it("Must return 200 when all is ok", async () => {
    const date = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const newDate = await request
      .put(`/user/date/${date.body._id}`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        date: new Date(),
      });

    expect(newDate.status).toBe(200);
  });

  it("Must return 404 when I try to update a date that is not mine", async () => {
    const date = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const newDate = await request
      .put(`/user/date/${date.body._id}`)
      .set({ authorization: `Bearer ${anotherClientToken}` })
      .send({
        date: new Date(),
      });

    expect(newDate.status).toBe(404);
  });

  it("Must return 400 if the new selected date collide with another", async () => {
    const testDate = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date("2025-08-20"),
      });

    const date = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const newDate = await request
      .put(`/user/date/${date.body._id}`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        date: new Date("2025-08-20"),
      });

    expect(newDate.status).toBe(400);
  });
});

describe("DELETE /user/date/:id", () => {
  it("Must return 200 when the date is succesfully deleted", async () => {
    const newDate = await request
      .post(`/user/${stylistId}/date`)
      .set({
        authorization: `Bearer ${clientToken}`,
      })
      .send({
        date: new Date(),
      });

    const response = await request
      .delete(`/user/date/${newDate.body._id}`)
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(200);
  });
});
