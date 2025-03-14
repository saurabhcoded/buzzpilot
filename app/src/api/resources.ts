import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { fireDb } from "../firebase/firebase";
import { AccountInterface, ConnectorInterface, PostInterface } from "../types";
import API_CALL from "./ApiTool";
import { URL_CONFIG } from "../_constants/url_config";
import notify from "../utils/notify";

export const getAvatarsList = () => {
  //  Firestore.
};

export const getConnectorsList = async (): Promise<ConnectorInterface[]> => {
  const querySnapshot = await getDocs(collection(fireDb, "connectors"));
  const connectorList: ConnectorInterface[] | any[] = querySnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );
  return connectorList;
};

// Get All user Accounts list
export const getAccountsList = async (
  userId: string
): Promise<AccountInterface[]> => {
  const userRef = doc(fireDb, "users", userId);
  const querySnapshot = await getDocs(
    query(collection(fireDb, "accounts"), where("user", "==", userRef))
  );

  const accountsList: AccountInterface[] | any[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      try {
        let docData = doc.data();
        const userSnap = await getDoc(docData.user);
        const connectorSnap = await getDoc(docData.connector);
        let userData: any = userSnap.exists() ? userSnap.data() : null;
        let connectorData: any = connectorSnap.exists()
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
  return accountsList;
};

export const getAccountListbyType = async (type = "social") => {
  let apiUrl = URL_CONFIG.account.getListAccount + type;
  const res = await API_CALL.get(apiUrl);
  if (res?.data?.status === 1) {
    return res?.data?.data as AccountInterface[];
  } else {
    notify.error(res?.data?.message);
    return [];
  }
};
// Get Account Data by AccountId
export const getAccountDatabyId = async (
  userId: string,
  accountId: string
): Promise<AccountInterface | null> => {
  const userRef = doc(fireDb, "users", userId);
  const querySnapshot = await getDocs(
    query(
      collection(fireDb, "accounts"),
      where("user", "==", userRef),
      where("id", "==", accountId)
    )
  );
  let accountData = querySnapshot.docs?.[0];
  if (accountData) {
    return accountData.data() as AccountInterface;
  } else {
    return null;
  }
};

// Get Account Data by comma separated AccountIds
export const getAccountDatabyIds = async (
  userId: string,
  accountIds: string
): Promise<AccountInterface[]> => {
  try {
    const userRef = doc(fireDb, "users", userId);
    const accountIdsArr = accountIds.split(",");
    const accountDataArr = await Promise.all(
      accountIdsArr.map(async (accountId) => {
        try {
          let accountDataRef = await getDoc(doc(fireDb, "accounts", accountId));
          let accountData = accountDataRef.data();
          accountData.id = accountDataRef.id;
          let connectorRef = await getDoc(accountData.connector);
          accountData.connector = connectorRef.data();
          return accountData;
        } catch (err) {
          return null;
        }
      })
    );
    // const accountData = querySnapshot.docs.map((doc) => doc.data());
    return accountDataArr as AccountInterface[];
  } catch (Err) {
    console.error(Err);
    return [];
  }
};

export const createAccountDoc = async (
  accountData: any
): Promise<{ status: boolean; data: string }> => {
  try {
    const accountPayload = {
      name: accountData.name,
      description: accountData.description,
      metadata: accountData?.metadata,
      auth_type: accountData?.auth_type,
      connectorId: accountData.connector,
      account_type: accountData.account_type,
    };
    const createAccountRes = await API_CALL.post(
      URL_CONFIG.account.createAccount,
      accountPayload
    );
    if (createAccountRes?.data?.status === 1) {
      return { status: true, data: createAccountRes?.data?.data?.accountId };
    } else {
      return { status: false, data: createAccountRes?.data?.message };
    }
  } catch (error) {
    console.error("Error creating account document:", error);
    return { status: false, data: "Error creating account document" };
  }
};

type deleteAccountType = {
  status: boolean;
  message: string;
};
// Delete account document
export const deleteAccountDoc = async (
  accountId: string
): Promise<deleteAccountType> => {
  let result = true,
    resultMessage = "";
  try {
    const deleteRes = await API_CALL.post(URL_CONFIG.account.deleteAccount, {
      accountId,
    });
    if (deleteRes?.data?.status === 1) {
      resultMessage = `Account ${accountId} deleted successfully.`;
      result = true;
    } else {
      resultMessage = deleteRes?.data?.message;
      result = false;
    }
  } catch (error) {
    console.error(error);
    resultMessage = "Error deleting account:";
    result = false;
  }
  return { status: result, message: resultMessage };
};

export const isAccountNameDuplicate = async (
  accountName: string,
  connectorId: string | undefined
): Promise<boolean> => {
  try {
    const accountsRef = collection(fireDb, "accounts");
    // Convert connector ID into a Firestore reference
    const connectorRef = doc(fireDb, "connectors", connectorId);

    // Query accounts where name and connector match
    const q = query(
      accountsRef,
      where("name", "==", accountName),
      where("connector", "==", connectorRef) // Compare as reference
    );

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // If any document exists, name is duplicate
  } catch (error) {
    console.error("❌ Error checking duplicate account name:", error);
    return false;
  }
};

// Posts Data
export const getPostsList = async (
  userId: string
): Promise<PostInterface[]> => {
  const userRef = doc(fireDb, "users", userId);
  const querySnapshot = await getDocs(
    query(collection(fireDb, "posts"), where("user", "==", userRef))
  );

  const postsList: PostInterface[] | any[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      try {
        let docData = doc.data();
        let accountData = await getAccountDatabyIds(
          userId,
          docData?.metadata?.accounts
        );
        return {
          id: doc.id,
          accountData,
          ...docData,
        } as PostInterface;
      } catch (Err) {
        console.error(Err);
        return {
          id: doc.id,
          accountData: null,
          ...doc.data(),
        };
      }
    })
  );
  return postsList;
};
