const asyncHandler = require("../middleware/asyncHandler");

const {
  successResponse,
} = require("../utils/response");

const {
  createAnnouncement:
    createAnnouncementService,

  getPublishedAnnouncements:
    getPublishedAnnouncementsService,

  getAllAnnouncements:
    getAllAnnouncementsService,

  getAnnouncementById:
    getAnnouncementByIdService,

  updateAnnouncement:
    updateAnnouncementService,

  publishAnnouncement:
    publishAnnouncementService,

  unpublishAnnouncement:
    unpublishAnnouncementService,

  deleteAnnouncement:
    deleteAnnouncementService,
} = require("../services/announcement.service");

// =====================================
// CREATE ANNOUNCEMENT
// ADMIN
// =====================================

exports.createAnnouncement =
  asyncHandler(async (req, res) => {

    const announcement =
      await createAnnouncementService({
        ...req.body,
        createdBy: req.user._id,
      });

    return successResponse(
      res,
      201,
      "Announcement created successfully.",
      announcement
    );
  });

// =====================================
// GET PUBLISHED ANNOUNCEMENTS
// STUDENT
// =====================================

exports.getPublishedAnnouncements =
  asyncHandler(async (req, res) => {

    const limit =
      Number(req.query.limit) || 5;

    const announcements =
      await getPublishedAnnouncementsService(
        limit
      );

    return successResponse(
      res,
      200,
      "Announcements fetched successfully.",
      {
        announcements,
      }
    );
  });

// =====================================
// GET ALL ANNOUNCEMENTS
// ADMIN
// =====================================

exports.getAllAnnouncements =
  asyncHandler(async (req, res) => {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const type =
      req.query.type || "";

    const status =
      req.query.status || "";

    const result =
      await getAllAnnouncementsService({
        page,
        limit,
        search,
        type,
        status,
      });

    return successResponse(
      res,
      200,
      "Announcements fetched successfully.",
      result
    );
  });

// =====================================
// GET ANNOUNCEMENT BY ID
// ADMIN
// =====================================

exports.getAnnouncementById =
  asyncHandler(async (req, res) => {

    const announcement =
      await getAnnouncementByIdService(
        req.params.id
      );

    return successResponse(
      res,
      200,
      "Announcement fetched successfully.",
      announcement
    );
  });

// =====================================
// UPDATE ANNOUNCEMENT
// ADMIN
// =====================================

exports.updateAnnouncement =
  asyncHandler(async (req, res) => {

    const announcement =
      await updateAnnouncementService(
        req.params.id,
        req.body
      );

    return successResponse(
      res,
      200,
      "Announcement updated successfully.",
      announcement
    );
  });

// =====================================
// PUBLISH ANNOUNCEMENT
// ADMIN
// =====================================

exports.publishAnnouncement =
  asyncHandler(async (req, res) => {

    const announcement =
      await publishAnnouncementService(
        req.params.id
      );

    return successResponse(
      res,
      200,
      "Announcement published successfully.",
      announcement
    );
  });

// =====================================
// UNPUBLISH ANNOUNCEMENT
// ADMIN
// =====================================

exports.unpublishAnnouncement =
  asyncHandler(async (req, res) => {

    const announcement =
      await unpublishAnnouncementService(
        req.params.id
      );

    return successResponse(
      res,
      200,
      "Announcement unpublished successfully.",
      announcement
    );
  });

// =====================================
// DELETE ANNOUNCEMENT
// ADMIN
// =====================================

exports.deleteAnnouncement =
  asyncHandler(async (req, res) => {

    const result =
      await deleteAnnouncementService(
        req.params.id
      );

    return successResponse(
      res,
      200,
      "Announcement deleted successfully.",
      result
    );
  });