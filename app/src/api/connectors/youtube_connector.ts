import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";
import API_CALL, { API_CALL_FORMDATA } from "../ApiTool";

export const createYoutubePost = async (token: string, postData: any) => {
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
  formData.append("metadata", JSON.stringify(metadata));
  formData.append("file", postData?.document);

  try {
    const response = await API_CALL_FORMDATA.post(
      URL_CONFIG.connector.youtube.create_post,
      formData,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );
    if (response?.data?.status === 1) {
      notify.success(response?.data?.message);
    } else if (response?.data?.status === 0) {
      notify.error(response?.data?.message);
    }
    console.log("response", response?.data);
    // if (response.ok) {
    //   notify.success("Video uploaded successfully!");
    // } else {
    //   notify.error("Upload failed!");
    // }
  } catch (error: any) {
    console.error(error);
    let errorMessage =
      error?.response?.data?.message ?? error?.message ?? "Oops something went wrong!";
    notify.error(errorMessage);
  }
};
