const MSG91_VERIFY_ACCESS_TOKEN_URL =
  "https://control.msg91.com/api/v5/widget/verifyAccessToken";

const verifyMsg91AccessToken = async (accessToken) => {
  if (!process.env.MSG91_AUTH_KEY) {
    throw new Error("MSG91_AUTH_KEY is not configured.");
  }

  if (!accessToken) {
    return {
      success: false,
      message: "MSG91 access token is required.",
    };
  }

  const response = await fetch(MSG91_VERIFY_ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authkey: process.env.MSG91_AUTH_KEY,
      "access-token": accessToken,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      success: false,
      message: "MSG91 access token verification failed.",
      data,
    };
  }

  return {
    success: true,
    data,
  };
};

module.exports = {
  verifyMsg91AccessToken,
};