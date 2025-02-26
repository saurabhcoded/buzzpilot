const { fireAdmin } = require("../services/firebaseService");

// Middleware to authenticate Firebase users
const authenticateFirebaseUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await fireAdmin.auth().verifyIdToken(idToken);
    console.log("user", decodedToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Forbidden: Authentication failed",
      error: error.message,
    });
  }
};

module.exports = authenticateFirebaseUser;
