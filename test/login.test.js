// Написати unit - тести для контролера входу(логін)
// відповідь повина мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

// const request = require("supertest");
// const express = require("express");
// require("dotenv").config();

// const { PORT } = process.env;
// // const { userController } = require("../controllers");

// const app = express();
// // const app = require("../app");

// // app.post("/api/users/login", userController.login);

// describe("test login controllers", () => {
//     beforeAll(() => app.listen(PORT));
//     // afterAll(() => app.close());

//     const loginUser = {
//         email: "user@email.com",
//         password: "123456",
//     };
    
//     test("Create new user", async () => {
//         const response = await request(app)
//           .post("/api/users/register")
//           .send(loginUser);
//         console.log(response.status);
//     })
// })