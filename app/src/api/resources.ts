import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { fireDb } from "../firebase/firebase";
import { AccountInterface, ConnectorInterface, PostInterface } from "../types";

export const getAvatarsList = () => {
  //  Firestore.
};

export const getConnectorsList = async (): Promise<ConnectorInterface[]> => {
  const querySnapshot = await getDocs(collection(fireDb, "connectors"));
  const connectorList: ConnectorInterface[] | any[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return connectorList;
};
export const getAccountsList = async (userId: string): Promise<AccountInterface[]> => {
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
        let connectorData: any = connectorSnap.exists() ? connectorSnap.data() : null;
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
          connector: connectorData
        };
      } catch (Err) {
        console.error(Err);
        return {
          id: doc.id,
          ...doc.data()
        };
      }
    })
  );
  return accountsList;
};

export const createAccountDoc = async (accountData: any): Promise<string | null> => {
  try {
    const userRef = doc(fireDb, "users", accountData.userId);
    const connectorRef = doc(fireDb, "connectors", accountData.connector);
    const accountRef = await addDoc(collection(fireDb, "accounts"), {
      user: userRef,
      connector: connectorRef,
      name: accountData.name,
      description: accountData.description,
      active: true,
      auth_type: accountData?.auth_type,
      metadata: accountData?.metadata,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    console.log("Account document created with ID:", accountRef.id);
    return accountRef.id;
  } catch (error) {
    console.error("Error creating account document:", error);
    return null;
  }
};

type deleteAccountType = {
  status: boolean;
  message: string;
};
export const deleteAccountDoc = async (accountId: string): Promise<deleteAccountType> => {
  let result = true,
    resultMessage = "";
  try {
    const accountRef = doc(fireDb, "accounts", accountId);
    await deleteDoc(accountRef);

    resultMessage = `✅ Account ${accountId} deleted successfully.`;
    result = true;
  } catch (error) {
    console.error(error);
    resultMessage = "❌ Error deleting account:";
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
export const getPostsList = async (userId: string): Promise<PostInterface[]> => {
  const userRef = doc(fireDb, "users", userId);
  const querySnapshot = await getDocs(
    query(collection(fireDb, "posts"), where("user", "==", userRef))
  );

  const postsList: PostInterface[] | any[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      try {
        let docData = doc.data();
        return {
          id: doc.id,
          ...docData
        } as PostInterface;
      } catch (Err) {
        console.error(Err);
        return {
          id: doc.id,
          ...doc.data()
        };
      }
    })
  );
  return postsList;
};
