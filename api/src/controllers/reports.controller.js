const { doc, getDoc } = require("firebase/firestore");
const { fireDb } = require("../services/firebaseService");
const { google } = require("googleapis");
const clog = require("../services/ChalkService");

const getReportDetails = async (oauth2Client, jobId) => {
  try {
    const youtubeReporting = google.youtubereporting({ version: "v1", auth: oauth2Client });
    const response = await youtubeReporting.jobs.reports.list({ jobId });
    return response.data.reports;
  } catch (error) {
    clog.error(error);
    return null;
  }
};
exports.getReportData = async (req, res) => {
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
      return res.REST.BADREQUEST(0, "Youtube account not found", { accountId, accountData });
    }
    let accountMetadata = accountData?.data()?.metadata;
    accountMetadata = JSON.parse(accountMetadata);
    let AccessToken = accountMetadata?.accessToken,
      IdToken = accountMetadata?.idToken;
    if (!AccessToken) {
      return res.REST.BADREQUEST(0, "No Access token found", { accountId, accountData });
    }
    console.log("AccessToken", accountMetadata);

    const youtubeAnalytics = google.youtubeAnalytics("v2");
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: AccessToken, id_token: IdToken });
    const response = await youtubeAnalytics.reports.query({
      auth: oauth2Client,
      ids: "channel==MINE",
      startDate: startDate,
      endDate: endDate,
      metrics:
        "views,likes,dislikes,comments,subscribersGained,subscribersLost,averageViewDuration",
      dimensions: dimensions,
      sort: "day"
    });

    return res.REST.SUCCESS(1, "Reports fetched successfully", response?.data);
  } catch (error) {
    let errorData = error?.response?.data?.error;
    let errorMessage = errorData?.message ?? "Error fetching report types";
    console.error("Error fetching report types:", errorData ?? error);
    return res.REST.SERVERERROR(0, errorMessage, errorData);
  }
};
