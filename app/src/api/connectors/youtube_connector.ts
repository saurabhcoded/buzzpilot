import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";

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
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", postData?.document);

  try {
    const response = await fetch(URL_CONFIG.connector.youtube.upload_video, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Upload-Content-Type": "video/*"
      },
      body: formData
    });

    if (response.ok) {
      notify.success("Video uploaded successfully!");
    } else {
      notify.error("Upload failed!");
    }
  } catch (error) {
    console.error("Upload Error:", error);
    notify.error("Error uploading video.");
  }
};
