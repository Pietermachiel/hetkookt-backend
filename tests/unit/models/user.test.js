const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

// test suite = container for multiple tests
describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    // const user = new User({ _id: 1, isAdmin: true });
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    // console.log(user);
    // {
    //   active: false,
    //   stock: [],
    //   extra: [],
    //   _id: 5f19aab6487d12bf19b10cc7,
    //   isAdmin: true,
    //   items: []
    // }
    const token = user.generateAuthToken();
    // console.log(token); //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE5YWFiNjQ4N2QxMmJmMTliMTBjYzciLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1OTU1MTc2MjJ9.-sdy6AvUcYoYD2WY9_GmIDSD0De0wNacBNuzUly8QFU
    // console.log(payload); // { _id: '5f19aab6487d12bf19b10cc7', isAdmin: true }
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    // console.log(decoded); // { _id: '5f19aab6487d12bf19b10cc7', isAdmin: true, iat: 1595517622 }
    expect(decoded).toMatchObject(payload);
  });
});
