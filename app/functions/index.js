/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.uploadToYouTube = onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }
  
      try {
        const { accessToken, videoMetadata } = req.body;
  
        const response = await fetch(
          "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(videoMetadata),
          }
        );
  
        const location = response.headers.get("location");
  
        if (!location) {
          return res.status(400).send("Failed to initiate upload");
        }
  
        res.status(200).json({ uploadUrl: location });
      } catch (error) {
        console.error("Error uploading to YouTube:", error);
        res.status(500).send("Internal Server Error");
      }
    });
  });