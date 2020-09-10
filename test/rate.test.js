const { connectToTestDb, dropDatabase } = require("./utils/db");
const supertest = require("supertest");
const createServer = require("../src/server");
const request = supertest(createServer());
const generateFakeUser = require("./utils/faker");
let stylistId, clientToken;
beforeEach(async (done) => {
  await connectToTestDb();

  const clientRaw = generateFakeUser("client");
  const stylistRaw = generateFakeUser("stylist");

  await request.post("/auth/register").send(clientRaw);

  const stylistRegister = await request.post("/auth/register").send(stylistRaw);
  stylistId = stylistRegister.body._id;

  const clientLogin = await request.post("/auth/login").send({
    email: clientRaw.email,
    password: clientRaw.password,
  });

  clientToken = clientLogin.body.token;
  return done();
});

afterEach((done) => dropDatabase(done));

describe("POST /user/:id/rate", () => {
  it("Must return 201 when all is ok", async () => {
    const response = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });
    expect(response.status).toBe(201);
  });

  it("Must return 400 when user already has a rate for this stylist", async () => {
    await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 5,
        comment: "Very good service",
      });

    const response = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });

    expect(response.status).toBe(400);
  });

  it("Must return 400 if data is not valid", async () => {
    const response = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 6,
        comment: "V",
      });

    expect(response.status).toBe(400);
  });

  it("Must return 404 if stylist does not exist", async () => {
    const id = stylistId.substr(1) + "d";
    const response = await request
      .post(`/user/${id}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });

    expect(response.status).toBe(404);
  });
});

describe("GET /user/:id/rate", () => {
  it("Must return 200 when all is ok", async () => {
    const response = await request
      .get("/user/:id/rate")
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(200);
  });
});

describe("PUT /user/:id/rate/:id", () => {
  it("Must return 200 when all is ok", async () => {
    const { body } = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });
    const response = await request
      .put(`/user/${stylistId}/rate/${body._id}`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 5,
      });

    expect(response.status).toBe(200);
  });

  it("Must return 400 on invalid data", async () => {
    const { body } = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });

    const response = await request
      .put(`/user/${stylistId}/rate/${body._id}`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 6,
      });

    expect(response.status).toBe(400);
  });

  it("Must return 404 if stylist or rate does not exist", async () => {
    const { body } = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });

    const response = await request
      .put(
        `/user/${stylistId.substr(1) + "d"}/rate/${body._id.substr(1) + "d"}`
      )
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 5,
      });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /user/rate/:id", () => {
  it("Must return 200 when all is ok", async () => {
    const { body } = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });
    const response = await request
      .delete(`/user/${stylistId}/rate/${body._id}`)
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(200);
  });

  it("Must return 404 if user or rate does not exist", async () => {
    const { body } = await request
      .post(`/user/${stylistId}/rate`)
      .set({ authorization: `Bearer ${clientToken}` })
      .send({
        rate: 4,
        comment: "Very good service",
      });
    const response = await request
      .delete(
        `/user/${stylistId.substr(1) + "d"}/rate/${body._id.substr(1) + "d"}`
      )
      .set({ authorization: `Bearer ${clientToken}` });
    expect(response.status).toBe(404);
  });
});
