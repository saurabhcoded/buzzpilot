const { google } = require("googleapis");
const { commonConfig } = require("../config/config");

// Function to get a valid access token
const getValidGoogleAccessToken = async (credentials) => {
  const refresh_token = credentials?.refresh_token;
  let access_token = credentials?.access_token,
    expiry_date = credentials?.expiry_date;

  // TODO: Implement refresh_token not found logic
  if (!refresh_token) {
    return { access_token, expiry_date };
    // throw new Error("No refresh token available."); // Uncomment after TODO completes
  }

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    commonConfig.googleClientId,
    commonConfig.googleClientSecret
  );
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  // Check if access token is expired
  const tokenInfo = await oauth2Client
    .getTokenInfo(access_token)
    .catch(() => null);
  if (!tokenInfo || Date.now() >= tokenInfo.expiry_date) {
    console.log("Access token expired, refreshing...");
    // Refresh the access token
    const { credentials } = await oauth2Client.refreshAccessToken();
    access_token = credentials.access_token;
    expiry_date = credentials.expiry_date;
  }

  return { access_token, expiry_date };
};

module.exports = { getValidGoogleAccessToken };
