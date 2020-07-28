const request = require("supertest");
const { Book } = require("../../models/book");
const { User } = require("../../models/user");

describe("auth middleware", () => {
  let token;
  let server;

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Book.deleteMany({});
  });

  const exec = () => {
    return request(server)
      .post("/api/books")
      .set("x-auth-token", token)
      .send({ title: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  // hapi path
  it("should return 200 if a valid token is provided", async () => {
    // token = "";
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
