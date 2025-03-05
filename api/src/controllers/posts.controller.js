const { google } = require("googleapis");
const fs = require("fs");
const assert = require("assert");
const { doc, getDoc, setDoc } = require("firebase/firestore");
const { fireDb } = require("../services/firebaseService");
const { getValidGoogleAccessToken } = require("../services/connectorService");
const { deleteTemporaryFiles } = require("../services/UploadService");

exports.uploadVideotoYoutube = async (req, res) => {
  try {
    const { postData: _postData } = req.body;
    const videoFile = req.files?.videofile?.[0];
    // const thumbnail = req.files?.thumbnail?.[0];

    if (!videoFile || !_postData) {
      console.log("Missing video file or metadata");
      return res.REST.BADREQUEST(0, "Missing video file or metadata");
    }
    const videoPath = videoFile.path,
      videoStream = fs.createReadStream(videoPath);
    // const thumbnailPath = thumbnail?.path,
    //   thumbnailStream = fs.createReadStream(thumbnailPath);
    const postData = JSON.parse(_postData);
    const accountId = postData?.accounts?.split(",")?.[0];
    let accountRef = doc(fireDb, "accounts", accountId);
    let accountData = await getDoc(accountRef);
    if (!accountData.exists()) {
      console.log("Youtube account not found");
      return res.REST.BADREQUEST(0, "Youtube account not found", {
        accountId,
        accountData,
      });
    }
    let accountMetadata = accountData?.data()?.metadata;
    accountMetadata = JSON.parse(accountMetadata);

    let { access_token, expiry_date } = await getValidGoogleAccessToken(
      accountMetadata?.credentials
    );
    if (!access_token) {
      console.log("No Access token found");
      return res.REST.BADREQUEST(0, "No Access token found", {
        accountId,
        accountData,
      });
    }
    let updatedAccountMetadata = {
      ...accountMetadata,
      credentials: {
        ...accountMetadata.credentials,
        access_token: access_token,
        expiry_date: expiry_date,
      },
    };
    await setDoc(
      accountRef,
      { metadata: JSON.stringify(updatedAccountMetadata) },
      { merge: true }
    );
    const oauth2Client = new google.auth.OAuth2({});
    oauth2Client.setCredentials({ access_token: access_token });
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Upload Video Directly from Buffer
    let hashTags = postData?.hashTags;
    let finalDescription = postData?.description + `\n ${hashTags}`;
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: postData?.title,
          description: finalDescription,
          tags: postData.tags?.split(","),
          categoryId: "22",
        },
        status: {
          privacyStatus: postData?.privacy || "public",
        },
      },
      media: {
        body: videoStream,
      },
    });

    let postId = response.data.id,
      youtubeLink = `https://www.youtube.com/watch?v=${postId}`;

    const postRef = doc(fireDb, "posts", postId);
    let postMetadata = {
      postUrl: youtubeLink,
      accountId: postData?.accounts,
      tags: postData.tags,
      privacy: postData?.privacy || "public",
    };
    await setDoc(postRef, {
      id: postId,
      title: postData?.title,
      description: postData?.description,
      metadata: JSON.stringify(postMetadata),
      user: accountData?.data()?.user,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    deleteTemporaryFiles();
    return res.REST.SUCCESS(1, "Video Uploaded Successfully", {
      videoId: response.data.id,
      youtubeLink,
    });
  } catch (error) {
    console.error("YouTube Upload Error:", error);
    return res.REST.SERVERERROR(0, "Error Uploading Video to YouTube", error);
  }
};

// video category IDs for YouTube:
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28,
};

// If modifying these scopes, delete your previously saved credentials in client_oauth_token.json
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH = "../" + "client_oauth_token.json";

const videoFilePath = "../vid.mp4";
const thumbFilePath = "../thumb.png";

// exports.uploadVideo = (title, description, tags) => {
//   assert(fs.existsSync(videoFilePath));
//   assert(fs.existsSync(thumbFilePath));

//   // Load client secrets from a local file.
//   fs.readFile("../client_secret.json", function processClientSecrets(err, content) {
//     if (err) {
//       console.log("Error loading client secret file: " + err);
//       return;
//     }
//     // Authorize a client with the loaded credentials, then call the YouTube API.
//     authorize(JSON.parse(content), (auth) => uploadVideo(auth, title, description, tags));
//   });
// };

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideo(auth, title, description, tags) {
  const service = google.youtube("v3");

  service.videos.insert(
    {
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: categoryIds.ScienceTechnology,
          defaultLanguage: "en",
          defaultAudioLanguage: "en",
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    },
    function (err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      }
      console.log(response.data);

      console.log("Video uploaded. Uploading the thumbnail now.");
      service.thumbnails.set(
        {
          auth: auth,
          videoId: response.data.id,
          media: {
            body: fs.createReadStream(thumbFilePath),
          },
        },
        function (err, response) {
          if (err) {
            console.log("The API returned an error: " + err);
            return;
          }
          console.log(response.data);
        }
      );
    }
  );
}
