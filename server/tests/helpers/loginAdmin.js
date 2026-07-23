const request = require("supertest");
const app = require("../../app");

const createAdmin = require("./createAdmin");
const users = require("../fixtures/users");

const loginAdmin = async () => {

  await createAdmin();

  const response = await request(app)
    .post("/api/auth/admin/login")
    .send({
      emailOrPhone: users.admin.email,
      password: users.admin.password,
    });

  return response.body.token;

};

module.exports = loginAdmin;