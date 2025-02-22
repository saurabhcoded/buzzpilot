const admin = require("firebase-admin");
const { google } = require("googleapis");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase_service.json"))
});

exports.verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    req.firebaseToken = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Firebase Token" });
  }
};
