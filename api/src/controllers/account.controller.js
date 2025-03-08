const {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDoc,
} = require("firebase/firestore");
const { backendProjectEnums } = require("../config/config");
const clog = require("../services/ChalkService");
const {
  getGoogleAccessTokenfromAuthCode,
} = require("./connector/connector.controller");
const { fireDb } = require("../services/firebaseService");

// To Create the Account of User
exports.createUserAccount = async (req, res) => {
  try {
    const userData = req?.user;
    let accountData = {
      name: req.body?.name,
      description: req.body?.description,
      metadata: req.body?.metadata,
      auth_type: req.body?.auth_type,
      connector: req.body?.connectorId,
    };
    let connectorRef = doc(fireDb, "connectors", accountData?.connector);
    let userRef = doc(fireDb, "users", userData?.uid);
    let connectorDoc = await getDoc(connectorRef);
    let connectorDocData = connectorDoc?.data();
    let authCreds = null;

    // Generate Authentication Credentials
    // 1. Youtube
    if (
      connectorDocData.connector_id ===
      backendProjectEnums.connectorTypes.youtube
    ) {
      let authCredsRes = await getGoogleAccessTokenfromAuthCode(
        accountData?.metadata?.auth_code
      );
      if (authCredsRes?.status) {
        delete accountData.metadata.auth_code;
        authCreds = authCredsRes?.data;
      } else {
        return res.REST.BADREQUEST(
          0,
          "Error while get connector token",
          authCredsRes?.data
        );
      }
    }
    // 2. Linkedin
    // 3. Instagram
    // 4. Threads
    // 5. Youtube

    // setting credentials to metadata
    accountData.metadata.credentials = authCreds;

    // Create Account Doc
    const accountRef = await addDoc(collection(fireDb, "accounts"), {
      user: userRef,
      connector: connectorRef,
      name: accountData.name,
      description: accountData.description,
      active: true,
      auth_type: accountData?.auth_type,
      metadata: JSON.stringify(accountData?.metadata),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return res.REST.SUCCESS(1, "Account created successfully", {
      accountId: accountRef?.id,
    });
  } catch (Err) {
    clog.error(Err);
    let errorMessage = Err?.message;
    return res.REST.SERVERERROR(0, errorMessage, Err);
  }
};

// To Edit the Account of User
exports.editUserAccount = async (req, res) => {
  try {
    console.log("body", req.body);
  } catch (Err) {
    clog.error(Err);
    let errorMessage = Err?.message;
    return res.REST.SERVERERROR(0, errorMessage, Err);
  }
};

// to Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    let accountId = req?.body?.accountId;
    const accountRef = doc(fireDb, "accounts", accountId);
    await deleteDoc(accountRef);
    resultMessage = `✅ Account ${accountId} deleted successfully.`;
    return res.REST.SUCCESS(1, resultMessage);
  } catch (Err) {
    let errorMessage = Err?.message;
    return res.REST.SERVERERROR(0, errorMessage, Err);
  }
};
