const request = require("supertest");
const { Book } = require("../../models/book");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/books", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Book.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all books", async () => {
      await Book.collection.insertMany([
        { title: "book1" },
        { title: "book2" },
      ]);
      //
      const res = await request(server).get("/api/books");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.title === "book1")).toBeTruthy();
      expect(res.body.some((g) => g.title === "book2")).toBeTruthy();
    });
  });
  describe("GET /", () => {
    it("should return a book if valid id is passed", async () => {
      const book = new Book({ title: "book1" });
      await book.save();

      const res = await request(server).get(`/api/books/${book._id}`);

      expect(res.status).toBe(200);
      // expect(res.body).toMatchObject(book) // werkt niet omdat de server een string geeft en new Book een ObjectId
      expect(res.body).toHaveProperty("title", book.title);
    });
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/books/1`);

      expect(res.status).toBe(404);
    });
    it("should return 404 if no book with the given id exists", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get(`/api/books/${id}`);

      expect(res.status).toBe(404);
    });
  });
  // describe("POST /", () => {
  //   // Define the happy path, and then in each test, we change
  //   // one parameter tha clearly aligns with the title of the test.

  //   let token;
  //   let title;

  //   const exec = async () => {
  //     return await request(server)
  //       .post("/api/books")
  //       .set("x-auth-token", token)
  //       .send({ title });
  //   };

  //   beforeEach(() => {
  //     token = new User().generateAuthToken();
  //     title = "book1";
  //   });

  //   // test if the auth middleware is included before the route handler
  //   it("should return 401 if client is not logged in", async () => {
  //     token = "";

  //     const res = await exec();

  //     expect(res.status).toBe(401); // Not authorized
  //   });
  //   it("should return 400 if book is les than 5 characters", async () => {
  //     title = "1234";

  //     const res = await exec();

  //     expect(res.status).toBe(400); // Bad request
  //   });
  //   it("should return 400 if book is more than 50 characters", async () => {
  //     title = new Array(52).join("x");

  //     const res = await exec();

  //     expect(res.status).toBe(400); // Bad request
  //   });
  //   it("should save the book if it is valid", async () => {
  //     const res = await exec();

  //     const book = await Book.find({ title: "book1" });

  //     expect(book).not.toBeNull();
  //   });
  //   // it("should return the book if it is valid", async () => {
  //   //   const res = await exec();

  //   //   expect(res.body).toHaveProperty("_id");
  //   //   expect(res.body).toHaveProperty("title", "book1");
  //   // });
  // });
  // describe("PUT /:id", () => {
  //   let token;
  //   let newTitle;
  //   let book;
  //   let id;

  //   const exec = async () => {
  //     return await request(server)
  //       .put("/api/books/" + id)
  //       .set("x-auth-token", token)
  //       .send({ title: newTitle });
  //   };

  //   beforeEach(async () => {
  //     // Before each test we need to create a book and
  //     // put it in the database.
  //     book = new Book({ title: "book1" });
  //     await book.save();

  //     token = new User().generateAuthToken();
  //     id = book._id;
  //     newTitle = "updateTitle";
  //   });

  //   it("should return 401 if client is not logged in", async () => {
  //     token = "";

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });

  //   it("should return 400 if book is less than 5 characters", async () => {
  //     newTitle = "1234";

  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 if book is more than 50 characters", async () => {
  //     newTitle = new Array(52).join("a");

  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 404 if id is invalid", async () => {
  //     id = 1;

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   // it("should return 404 if book with the given id was not found", async () => {
  //   //   id = mongoose.Types.ObjectId();

  //   //   const res = await exec();

  //   //   expect(res.status).toBe(404);
  //   // });

  //   // it("should update the book if input is valid", async () => {
  //   //   await exec();

  //   //   const updatedBook = await Book.findById(book._id);

  //   //   expect(updatedBook.title).toBe(newTitle);
  //   // });

  //   // it("should return the updated book if it is valid", async () => {
  //   //   const res = await exec();

  //   //   expect(res.body).toHaveProperty("_id");
  //   //   expect(res.body).toHaveProperty("title", newTitle);
  //   // });
  // });

  // describe("DELETE /:id", () => {
  //   let token;
  //   let book;
  //   let id;

  //   const exec = async () => {
  //     return await request(server)
  //       .delete("/api/books/" + id)
  //       .set("x-auth-token", token)
  //       .send();
  //   };

  //   beforeEach(async () => {
  //     // Before each test we need to create a book and
  //     // put it in the database.
  //     book = new Book({ title: "book1" });
  //     await book.save();

  //     id = book._id;
  //     token = new User({ isAdmin: true }).generateAuthToken();
  //   });

  //   it("should return 401 if client is not logged in", async () => {
  //     token = "";

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });

  //   it("should return 403 if the user is not an admin", async () => {
  //     token = new User({ isAdmin: false }).generateAuthToken();

  //     const res = await exec();

  //     expect(res.status).toBe(403);
  //   });

  //   it("should return 404 if id is invalid", async () => {
  //     id = 1;

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it("should return 404 if no book with the given id was found", async () => {
  //     id = mongoose.Types.ObjectId();

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it("should delete the book if input is valid", async () => {
  //     await exec();

  //     const bookInDb = await Book.findById(id);

  //     expect(bookInDb).toBeNull();
  //   });

  //   it("should return the removed book", async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty("_id", book._id.toHexString());
  //     expect(res.body).toHaveProperty("title", book.title);
  //   });
  // });
});
