import { loadAuth2, loadGapiInsideDOM } from "gapi-script";
import { projectEnums } from "../../_constants/project_enums";
import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";
import API_CALL, { API_CALL_FORMDATA } from "../ApiTool";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fireAuth } from "../../firebase/firebase";

export const createYoutubePost = async (postData: any) => {
  const formData = new FormData();
  formData.append("postData", JSON.stringify(postData));
  formData.append("file", postData?.document);

  try {
    const response = await API_CALL_FORMDATA.post(
      URL_CONFIG.posts.youtube.createpost,
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

function authenticate(authUrl) {
  return new Promise((resolve, reject) => {
    if (!authUrl) {
      return reject({ status: false, message: "Invalid authentication URL" });
    }

    // Open OAuth login window
    let authWindow = window.open(authUrl, "_blank", "width=600,height=700");

    if (!authWindow) {
      return reject({ status: false, message: "Popup blocked by browser" });
    }

    // Listen for messages from the OAuth popup
    function eventListener(event) {
      if (event.origin !== window.location.origin) return; // Security check

      const authData = event.data;
      if (authData?.status === "success") {
        resolve(authData); // Return authentication response
      } else {
        reject(authData);
      }

      authWindow.close();
      window.removeEventListener("message", eventListener);
    }

    window.addEventListener("message", eventListener);

    // Detect if the user closes the popup manually
    let checkPopup = setInterval(() => {
      console.log("authWindow", authWindow, authWindow.document);
      if (!authWindow || authWindow.closed) {
        clearInterval(checkPopup);
        reject({
          status: false,
          message: "Authentication window closed by user",
        });
      }
    }, 500);
  });
}

// Connect Youtube Account
export const connectYoutubeAccount = async () => {
  try {
    const authurl_res = await API_CALL.get(
      URL_CONFIG.account.youtube.getAuthUrl
    );
    if (authurl_res?.data?.status) {
      let authenticationUrl = authurl_res?.data?.data;
      let authResponse: any = await authenticate(
        authenticationUrl
      );
      console.log("authResponse", authResponse);
      if (authResponse?.status === "success") {
        return {
          status: true,
          message: "Authentication successfull",
          code: authResponse?.token,
        };
      } else {
        return {
          status: false,
          message: "Authentication Failed",
        };
      }
    } else {
      return { status: false, message: authurl_res?.data?.message };
    }
  } catch (error) {
    console.error("Error connecting YouTube account:", error);
  }
};

// Connect Gdrive Account
export const connectGdriveAccount = async () => {
  try {
    const authurl_res = await API_CALL.get(
      URL_CONFIG.account.gdrive.getAuthUrl
    );
    if (authurl_res?.data?.status) {
      let authenticationUrl = authurl_res?.data?.data;
      let authResponse: any = await authenticate(
        authenticationUrl
      );
      console.log("authResponse", authResponse);
      if (authResponse?.status === "success") {
        return {
          status: true,
          message: "Authentication successfull",
          code: authResponse?.token,
        };
      } else {
        return {
          status: false,
          message: "Authentication Failed",
        };
      }
    } else {
      return { status: false, message: authurl_res?.data?.message };
    }
  } catch (error) {
    console.error("Error connecting YouTube account:", error);
  }
};

// Load Youtube Accunt
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
