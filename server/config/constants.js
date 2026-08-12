const PASS_PERCENTAGE = 33;

const SETTING_KEYS = Object.freeze({
  PASS_PERCENTAGE: "passPercentage",
});

const SETTING_DEFAULTS = Object.freeze({
  [SETTING_KEYS.PASS_PERCENTAGE]: PASS_PERCENTAGE,
});

module.exports = {
  PASS_PERCENTAGE,
  SETTING_KEYS,
  SETTING_DEFAULTS,
};