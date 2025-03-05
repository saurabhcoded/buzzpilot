import React from "react";
import { resources } from "../../_constants/data";
import { postFormValuesInterface } from "./CreatePostForm";
import YoutubePreview from "./Previews/YoutubePreview";
import YoutubePreviewMobile from "./Previews/YoutubePreviewMobile";

const PostPreview = ({ postData }: { postData: postFormValuesInterface }) => {
  return (
    <div className="preview_wrapper">
      {/* <YoutubePreviewMobile postData={postData} /> */}
      <YoutubePreview />
    </div>
  );
};

export default PostPreview;
