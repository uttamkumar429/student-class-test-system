const request = require("supertest");

const app = require("../../app");

const createUser = require("./createUser");

const users = require("../fixtures/users");

const loginUser = async () => {

  await createUser(users.student);

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      emailOrPhone: users.student.email,
      password: users.student.password,
    });

  return response.body.token;

};

module.exports = loginUser;