const { doc, getDoc } = require("firebase/firestore");
const { fireDb } = require("../services/firebaseService");
const { google } = require("googleapis");
const clog = require("../services/ChalkService");
const { commonConfig } = require("../config/config");

// Function will return the callback data and query to frontend
exports.connectCallbackController = async (req, res) => {
  res.json({ body: req?.body, query: req?.query });
};

// Manage Youtube Connector
const oauth2Client = new google.auth.OAuth2(
  commonConfig.googleClientId,
  commonConfig.googleClientSecret,
  commonConfig.googleCallbackUrl
);

exports.connectYoutubeAccount = async (req, res) => {
  try {
    const youtubeAuthurl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: commonConfig.connector.youtube.scopes,
    });
    return res.REST.SUCCESS(
      1,
      "Auth url generated successfully",
      youtubeAuthurl
    );
  } catch (Err) {
    clog.error(Err);
    let errorMessage = Err?.message;
    return res.REST.SERVERERROR(0, errorMessage, Err);
  }
};
exports.getYoutubeAccessTokenfromAuthCode = async (auth_code) => {
  try {
    if (!auth_code)
      return {
        status: false,
        message: "Authentication Code not found",
      };
    let credentials = await oauth2Client.getToken(auth_code);
    return {
      status: true,
      message: "Credentials generated",
      data: credentials,
    };
  } catch (Err) {
    clog.error(Err);
    return {
      status: false,
      error: Err,
    };
  }
};

exports.saveYoutubeAccount = async (req, res) => {
  console.log(req?.body);
  try {
    let accountId = req?.body?.accountId,
      dimensions = req?.body?.dimensions ?? "day",
      startDate = req?.body?.startDate ?? "2025-02-01",
      endDate = req?.body?.endDate ?? "2025-02-23";
    if (!accountId) {
      return res.REST.BADREQUEST(0, "Account Id not found");
    }
    let accountRef = doc(fireDb, "accounts", accountId);
    let accountData = await getDoc(accountRef);
    if (!accountData.exists()) {
      return res.REST.BADREQUEST(0, "Youtube account not found", {
        accountId,
        accountData,
      });
    }
    let accountMetadata = accountData?.data()?.metadata;
    accountMetadata = JSON.parse(accountMetadata);
    let AccessToken = accountMetadata?.accessToken,
      IdToken = accountMetadata?.idToken;
    if (!AccessToken) {
      return res.REST.BADREQUEST(0, "No Access token found", {
        accountId,
        accountData,
      });
    }
    console.log("AccessToken", accountMetadata);

    const youtubeAnalytics = google.youtubeAnalytics("v2");
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: AccessToken,
      id_token: IdToken,
    });
    const response = await youtubeAnalytics.reports.query({
      auth: oauth2Client,
      ids: "channel==MINE",
      startDate: startDate,
      endDate: endDate,
      metrics:
        "views,likes,dislikes,comments,subscribersGained,subscribersLost,averageViewDuration",
      dimensions: dimensions,
      sort: "day",
    });

    return res.REST.SUCCESS(1, "Reports fetched successfully", response?.data);
  } catch (error) {
    let errorData = error?.response?.data?.error;
    let errorMessage = errorData?.message ?? "Error fetching report types";
    console.error("Error fetching report types:", errorData ?? error);
    return res.REST.SERVERERROR(0, errorMessage, errorData);
  }
};

// Manage Linkedin Connector

// Manage Instagram Connector
