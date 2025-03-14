const { doc, getDoc } = require("firebase/firestore");
const { fireDb } = require("./firebaseService");

const getAccountDatabyId = async (accountId) => {
  if (!accountId) return { status: false, message: "Account ID is required" };
  let accountRef = doc(fireDb, "accounts", accountId);
  let accountDoc = await getDoc(accountRef);
  if (!accountDoc.exists()) {
    return { status: false, data: null };
  } else {
    let accountData = accountDoc?.data();
    let metadata = JSON.parse(accountData?.metadata);
    return { status: true, data: accountData, metadata };
  }
};

const validateAccountbyId = async (accountId) => {
  let accountRef = doc(fireDb, "accounts", accountId);
  let accountData = await getDoc(accountRef);
  if (!accountData.exists()) {
    return false;
  } else {
    return true;
  }
  // todo update this function for validating token of account also
};

const validateAccountsList = async (accountIds) => {
  if (Array.isArray(accountIds)) {
    let status = accountIds.every(
      async (item) => await validateAccountbyId(item)
    );
    return status;
  } else {
    return false;
  }
};

module.exports = {
  getAccountDatabyId,
  validateAccountbyId,
  validateAccountsList,
};
