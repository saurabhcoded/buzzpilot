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

module.exports = { getAccountDatabyId };
