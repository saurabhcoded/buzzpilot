const { google } = require("googleapis");
const { commonConfig } = require("../config/config");

// Function to get a valid access token
const getValidGoogleAccessToken = async (credentials) => {
  const refreshToken = credentials?.refreshToken;
  let accessToken = credentials?.accessToken;

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    commonConfig.googleClientId,
    commonConfig.googleClientSecret
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Check if access token is expired
  const tokenInfo = await oauth2Client
    .getTokenInfo(accessToken)
    .catch(() => null);
  if (!tokenInfo || Date.now() >= tokenInfo.expiry_date) {
    console.log("Access token expired, refreshing...");

    // Refresh the access token
    const { credentials } = await oauth2Client.refreshAccessToken();
    accessToken = credentials.access_token;
  }

  return accessToken;
};

module.exports = { getValidGoogleAccessToken };
