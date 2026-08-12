const SystemSetting = require("../models/SystemSetting");
const ApiError = require("../utils/ApiError");

const {
  SETTING_KEYS,
  SETTING_DEFAULTS,
} = require("../config/constants");

// ======================================
// VALIDATION HELPERS
// ======================================

const validateSettingKey = (key) => {
  if (
    typeof key !== "string" ||
    key.trim() === ""
  ) {
    throw new ApiError(
      400,
      "Setting key is required."
    );
  }
};

const validatePercentage = (value) => {
  const percentage = Number(value);

  if (!Number.isFinite(percentage)) {
    throw new ApiError(
      400,
      "Pass percentage must be a valid number."
    );
  }

  if (percentage < 0 || percentage > 100) {
    throw new ApiError(
      400,
      "Pass percentage must be between 0 and 100."
    );
  }

  return percentage;
};

// ======================================
// GET SETTING
// ======================================

const getSetting = async (key) => {
  validateSettingKey(key);

  const normalizedKey = key.trim();

  const setting =
    await SystemSetting.findOne({
      key: normalizedKey,
    }).lean();

  if (setting) {
    return setting.value;
  }

  // --------------------------------------
  // Safe Default
  // --------------------------------------

  if (
    Object.prototype.hasOwnProperty.call(
      SETTING_DEFAULTS,
      normalizedKey
    )
  ) {
    return SETTING_DEFAULTS[
      normalizedKey
    ];
  }

  throw new ApiError(
    404,
    `Setting "${normalizedKey}" not found.`
  );
};

// ======================================
// GET NUMBER SETTING
// ======================================

const getNumberSetting = async (key) => {
  const value = await getSetting(key);

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new ApiError(
      500,
      `Setting "${key}" contains an invalid numeric value.`
    );
  }

  return numberValue;
};

// ======================================
// SET SETTING
// ======================================

const setSetting = async (
  key,
  value,
  updatedBy = null
) => {
  validateSettingKey(key);

  const normalizedKey = key.trim();

  let normalizedValue = value;

  // --------------------------------------
  // Known Setting Validation
  // --------------------------------------

  if (
    normalizedKey ===
    SETTING_KEYS.PASS_PERCENTAGE
  ) {
    normalizedValue =
      validatePercentage(value);
  }

  // --------------------------------------
  // Upsert Setting
  // --------------------------------------

  const setting =
    await SystemSetting.findOneAndUpdate(
      {
        key: normalizedKey,
      },
      {
        $set: {
          value: normalizedValue,
          updatedBy: updatedBy || null,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

  return setting;
};

// ======================================
// ENSURE DEFAULT SETTINGS
// ======================================

const ensureDefaultSettings = async () => {
  const entries = Object.entries(
    SETTING_DEFAULTS
  );

  for (const [key, value] of entries) {
    await SystemSetting.updateOne(
      {
        key,
      },
      {
        $setOnInsert: {
          key,
          value,
        },
      },
      {
        upsert: true,
      }
    );
  }
};

// ======================================
// GET ALL SETTINGS
// ======================================

const getAllSettings = async () => {
  const settings =
    await SystemSetting.find({})
      .select("key value updatedAt updatedBy")
      .sort({ key: 1 })
      .lean();

  const result = {};

  // --------------------------------------
  // Always start with defaults
  // --------------------------------------

  for (const [key, value] of Object.entries(
    SETTING_DEFAULTS
  )) {
    result[key] = value;
  }

  // --------------------------------------
  // Override with database values
  // --------------------------------------

  for (const setting of settings) {
    result[setting.key] = setting.value;
  }

  return result;
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  getSetting,
  getNumberSetting,
  setSetting,
  ensureDefaultSettings,
  getAllSettings,
};