import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";
import API_CALL, { API_CALL_FORMDATA } from "../ApiTool";
import { fireAuth } from "../../firebase/firebase";

export const createYoutubePost = async (postData: any) => {
  const postTags = postData?.tags
    .split(",")
    .map((item: string) => item?.trim?.())
    .filter(Boolean);
  const metadata = {
    snippet: {
      title: postData?.title,
      description: postData?.description,
      tags: postTags,
      categoryId: "22"
    },
    status: {
      privacyStatus: "public"
    }
  };
  const formData = new FormData();
  formData.append("postData", JSON.stringify(postData));
  formData.append("metadata", JSON.stringify(metadata));
  formData.append("file", postData?.document);

  try {
    const response = await API_CALL_FORMDATA.post(
      URL_CONFIG.connector.youtube.create_post,
      formData
    );
    if (response?.data?.status === 1) {
      notify.success(response?.data?.message);
    } else if (response?.data?.status === 0) {
      notify.error(response?.data?.message);
      return false;
    }
    return true;
  } catch (error: any) {
    console.error(error);
    let errorMessage =
      error?.response?.data?.message ?? error?.message ?? "Oops something went wrong!";
    notify.error(errorMessage);
    return false;
  }
};

export const connectYoutubeAccount = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube.force-ssl");
    provider.addScope("https://www.googleapis.com/auth/yt-analytics.readonly");

    // Sign in user with Google OAuth
    const result = await signInWithPopup(fireAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential) throw new Error("No credentials received");

    return credential;
  } catch (error) {
    console.error("Error connecting YouTube account:", error);
  }
};

export const loadYoutubeAccountReport = async (accountId: string, configs) => {
  let youtubeReport = await API_CALL.post("/dashboard/reports/youtube", {
    accountId,
    dimensions: "day",
    startDate: "2025-01-01",
    endDate: "2025-02-28"
  });
  return youtubeReport?.data;
};
