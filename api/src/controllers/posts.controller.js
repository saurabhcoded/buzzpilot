const { google } = require("googleapis");
const fs = require("fs");
const assert = require("assert");
const { doc, getDoc, setDoc, collection } = require("firebase/firestore");
const { fireDb } = require("../services/firebaseService");
const { getValidGoogleAccessToken } = require("../services/connectorService");
const { deleteTemporaryFiles } = require("../services/UploadService");
const { validateAccountsList } = require("../services/accountService");
const clog = require("../services/ChalkService");

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

exports.createpost = async (req, res) => {
  try {
    const postData = req.body;
    const postRef = doc(collection(fireDb, "posts"));
    let postObjData = {
      title: postData?.title,
      description: postData?.description,
      isScheduled: postData?.isScheduled,
      scheduleTime: postData?.scheduleTime ?? Date.now(),
      isPublished: false, // will be toggled to true if post is published
      publishTime: null, // will be updated to the time of publishing
      metadata: {},
      post_details: postData,
      user: req?.userRef,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    clog.info(postObjData);
    const postObj = await setDoc(postRef, postObjData);
    return res.REST.SUCCESS(1, "Post created successfully", postObj);
  } catch (error) {
    console.error("YouTube Upload Error:", error);
    return res.REST.SERVERERROR(0, "Error while creating post", error);
  }
};
