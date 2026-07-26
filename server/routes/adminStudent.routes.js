const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const adminStudentController = require("../controllers/adminStudent.controller");

router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  adminStudentController.getStudents
);

router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  adminStudentController.createStudent
);

router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  adminStudentController.getStudentById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  adminStudentController.updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  adminStudentController.deleteStudent
);
module.exports = router;