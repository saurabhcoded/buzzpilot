const { google } = require("googleapis");
const clog = require("../services/ChalkService");
const { commonConfig } = require("../config/config");

// Function will return the callback data and query to frontend
exports.connectCallbackController = async (req, res) => {
  let code = req?.query?.code;
  let credentials = await this.getGoogleAccessTokenfromAuthCode(code);
  if (!credentials?.status) {
    return res.REST.BADREQUEST(
      0,
      "Error while getting credentials",
      credentials?.data
    );
  }
  return res.json({ body: req?.body, query: req?.query, credentials });
};

const oauth2Client = new google.auth.OAuth2(
  commonConfig.googleClientId,
  commonConfig.googleClientSecret,
  commonConfig.googleCallbackUrl
);

exports.getGoogleAccessTokenfromAuthCode = async (auth_code) => {
  try {
    console.log("auth_code", auth_code);
    if (!auth_code)
      return {
        status: false,
        data: "Authentication Code not found",
      };

    let credentials = await oauth2Client.getToken(auth_code);
    return {
      status: true,
      data: credentials?.tokens,
    };
  } catch (Err) {
    let errorData = Err?.response?.data?.error || Err?.message || Err;
    return {
      status: false,
      data: errorData,
    };
  }
};
// **** Manage Youtube Connector ******
// API to connect Youtube Account
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

// API to validate Youtube Account
exports.validateConnectYoutubeAccount = async (req, res) => {
  try {

  } catch (Err) {
    clog.error(Err);
    let errorMessage = Err?.message;
    return res.REST.SERVERERROR(0, errorMessage, Err);
  }
};

// **** Manage GDrive Connector ******
// API to connect Google Drive account
exports.connectGDriveAccount = async (req, res) => {
  try {
    const youtubeAuthurl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: commonConfig.connector.drive.scopes,
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

// API to get items list from Google Drive
exports.getGdriveItemsList = async (req, res) => {
  try {
    const { access_token, folderId } = req.body;
    oauth2Client.setCredentials({ access_token });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Determine parent folder (root or specified folder)
    const parentFolder = folderId ? `'${folderId}'` : `'root'`;

    // Query to get both folders and files inside the given folder or root
    const query = `${parentFolder} in parents and trashed=false`;

    // Fetch folders and files inside the given folder or root
    const response = await drive.files.list({
      q: query,
      pageSize: 20,
      fields: "files(id, name, mimeType)",
    });

    // Separate folders and files
    const items = response.data.files || [];
    const folders = items.filter(
      (item) => item.mimeType === "application/vnd.google-apps.folder"
    );
    const files = items.filter(
      (item) => item.mimeType !== "application/vnd.google-apps.folder"
    );

    return res.REST.SUCCESS(1, "Folders and Files fetched successfully", {
      folders,
      files,
    });
  } catch (Err) {
    console.error("Google Drive API Error:", Err);
    return res.REST.SERVERERROR(0, Err?.message || "An error occurred", Err);
  }
};

// API to get file data by ID
exports.getGdriveFileData = async (req, res) => {
  try {
    const { access_token, fileId } = req.body;
    if (!fileId) {
      return res.REST.BADREQUEST(0, "File ID is required");
    }
    oauth2Client.setCredentials({ access_token });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    // Fetch file metadata
    const response = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink",
    });

    return res.REST.SUCCESS(1, "File data fetched successfully", response.data);
  } catch (Err) {
    console.error("Google Drive API Error:", Err);
    return res.REST.SERVERERROR(0, Err?.message || "An error occurred", Err);
  }
};

// API to delete a file by ID
exports.deleteGdriveFile = async (req, res) => {
  try {
    const { access_token, fileId } = req.query;
    console.log(req.query)
    if (!fileId) {
      return res.REST.BADREQUEST(0, "File ID is required");
    }
    oauth2Client.setCredentials({ access_token });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    // Delete the file
    await drive.files.delete({ fileId });

    return res.REST.SUCCESS(1, "File deleted successfully", { fileId });
  } catch (Err) {
    console.error("Google Drive API Error:", Err);
    return res.REST.SERVERERROR(0, Err?.message || "An error occurred", Err);
  }
};

// Manage Linkedin Connector

// Manage Instagram Connector
