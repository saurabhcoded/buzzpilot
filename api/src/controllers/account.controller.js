const {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
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
      account_type: req?.body?.account_type
    };
    let connectorRef = doc(fireDb, "connectors", accountData?.connector);
    console.log("userData", userData);
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
    // 2. Google Drive
    if (
      connectorDocData.connector_id ===
      backendProjectEnums.connectorTypes.gdrive
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

    // 3. Linkedin
    // 4. Instagram
    // 5. Threads
    // 6. Youtube

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
      account_type: accountData?.account_type,
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

// To List the Account of User
exports.getAccountsList = async (req, res) => {
  try {
    const { type } = req?.params;
    const userDataRef = req?.userRef;
    console.log("userData", userDataRef);

    let q = query(
      collection(fireDb, "accounts"),
      where("user", "==", userDataRef)
    );

    if (type !== "all") {
      q = query(q, where("account_type", "==", type));
    }

    const querySnapshot = await getDocs(q);
    const accountsList = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        try {
          let docData = doc.data();
          const userSnap = await getDoc(docData.user);
          const connectorSnap = await getDoc(docData.connector);
          let userData = userSnap.exists() ? userSnap.data() : null;
          let connectorData = connectorSnap.exists()
            ? connectorSnap.data()
            : null;
          try {
            userData.id = docData?.user?.id;
            connectorData.id = docData?.connector?.id;
          } catch (Err) {
            console.error(Err);
          }
          return {
            id: doc.id,
            ...docData,
            user: userData,
            connector: connectorData,
          };
        } catch (Err) {
          console.error(Err);
          return {
            id: doc.id,
            ...doc.data(),
          };
        }
      })
    );
    return res.REST.SUCCESS(1, "Accounts fetched successfully", accountsList);
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
