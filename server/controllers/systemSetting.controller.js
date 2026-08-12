const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const {
  successResponse,
} = require("../utils/response");

const {
  SETTING_KEYS,
} = require("../config/constants");

const {
  getAllSettings,
  getSetting,
  setSetting,
  ensureDefaultSettings,
} = require("../services/systemSetting.service");

// ======================================
// GET ALL SYSTEM SETTINGS
// ======================================

exports.getSettings = asyncHandler(
  async (req, res) => {
    await ensureDefaultSettings();

    const settings =
      await getAllSettings();

    return successResponse(
      res,
      200,
      "Settings fetched successfully.",
      settings
    );
  }
);

// ======================================
// GET SINGLE SETTING
// ======================================

exports.getSetting = asyncHandler(
  async (req, res) => {
    const { key } = req.params;

    const value = await getSetting(key);

    return successResponse(
      res,
      200,
      "Setting fetched successfully.",
      {
        key,
        value,
      }
    );
  }
);

// ======================================
// UPDATE PASS PERCENTAGE
// ======================================

exports.updatePassPercentage =
  asyncHandler(
    async (req, res) => {
      const { value } = req.body;

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        throw new ApiError(
          400,
          "Pass percentage is required."
        );
      }

      const setting =
        await setSetting(
          SETTING_KEYS.PASS_PERCENTAGE,
          value,
          req.user._id
        );

      return successResponse(
        res,
        200,
        "Pass percentage updated successfully.",
        {
          key: setting.key,
          value: setting.value,
          updatedAt:
            setting.updatedAt,
        }
      );
    }
  );