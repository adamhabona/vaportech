/**
 * REWARDS_TEST_MODE=1 lets Rewards run on a live deploy before Twilio and
 * Clover are connected: login code 123456, mock Clover register, a visible
 * test banner. Turn it off once real keys are in.
 */
export const isTestMode = () => process.env.REWARDS_TEST_MODE === "1";

/** True when mocks are allowed: local dev or explicit test mode. */
export const mocksAllowed = () => process.env.NODE_ENV !== "production" || isTestMode();

export const TEST_OTP_CODE = "123456";
