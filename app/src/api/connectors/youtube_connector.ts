import {
  GoogleAuthProvider,
  OAuthCredential,
  signInWithPopup,
} from "firebase/auth";
import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";
import API_CALL, { API_CALL_FORMDATA } from "../ApiTool";
import { fireAuth } from "../../firebase/firebase";
import { loadAuth2, loadGapiInsideDOM } from "gapi-script";
import { projectEnums } from "../../_constants/project_enums";

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
      categoryId: "22",
    },
    status: {
      privacyStatus: "public",
    },
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
      error?.response?.data?.message ??
      error?.message ??
      "Oops something went wrong!";
    notify.error(errorMessage);
    return false;
  }
};

// Version 1 Fix: Issue: Updating the Logged in User
export const connectYoutubeAccount = async () => {
  try {
    const authurl_res = await API_CALL.get(
      URL_CONFIG.account.youtube.getAuthUrl
    );
    if (authurl_res?.data?.status) {
      
      return { status: false, message: authurl_res?.data?.message };
    } else {
      return { status: false, message: authurl_res?.data?.message };
    }
    console.log("authurl_res", authurl_res);
  } catch (error) {
    console.error("Error connecting YouTube account:", error);
  }
};

// Version 2
export const connectYoutubeAccountV2 = async () => {
  try {
    const gapi = await loadGapiInsideDOM();
    let connectScopes =
      "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/yt-analytics.readonly";
    let auth2 = await loadAuth2(
      gapi,
      projectEnums.google_clientId,
      connectScopes
    );
    return auth2;
  } catch (error) {
    console.error("Error connecting YouTube account:", error);
  }
};

export const loadYoutubeAccountReport = async (
  accountId: string,
  configs: { startDate?: string; endDate?: string }
) => {
  let youtubeReport = await API_CALL.post("/dashboard/reports/youtube", {
    accountId,
    dimensions: "day",
    startDate: configs?.startDate ?? "2025-01-01",
    endDate: configs?.endDate ?? "2025-02-28",
  });
  return youtubeReport?.data;
};
