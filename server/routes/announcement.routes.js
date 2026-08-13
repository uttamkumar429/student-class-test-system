const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const authorize =
  require("../middleware/role.middleware");

const announcementController =
  require("../controllers/announcement.controller");

// =====================================
// STUDENT — PUBLISHED ANNOUNCEMENTS
// GET /api/announcements
// =====================================

router.get(
  "/",
  protect,
  authorize("student"),
  announcementController.getPublishedAnnouncements
);

// =====================================
// ADMIN — ALL ANNOUNCEMENTS
// GET /api/announcements/admin
// =====================================

router.get(
  "/admin",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.getAllAnnouncements
);

// =====================================
// ADMIN — GET BY ID
// GET /api/announcements/:id
// =====================================

router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.getAnnouncementById
);

// =====================================
// ADMIN — CREATE
// POST /api/announcements
// =====================================

router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.createAnnouncement
);

// =====================================
// ADMIN — UPDATE
// PUT /api/announcements/:id
// =====================================

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.updateAnnouncement
);

// =====================================
// ADMIN — PUBLISH
// POST /api/announcements/:id/publish
// =====================================

router.post(
  "/:id/publish",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.publishAnnouncement
);

// =====================================
// ADMIN — UNPUBLISH
// POST /api/announcements/:id/unpublish
// =====================================

router.post(
  "/:id/unpublish",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.unpublishAnnouncement
);

// =====================================
// ADMIN — DELETE
// DELETE /api/announcements/:id
// =====================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  announcementController.deleteAnnouncement
);

module.exports = router;