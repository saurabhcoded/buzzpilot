import React from "react";
import { resources } from "../../_constants/data";
import { postFormValuesInterface } from "./CreatePostForm";

const PostPreview = ({ postData }: { postData: postFormValuesInterface }) => {
  return (
    <div className="flex flex-row justify-center bg-gray-200 rounded-md p-4">
      <div className="mockup-phone mx-auto w-fit">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1">
            <img
              src={resources.youtubeDemo}
              height={"100%"}
              className="height"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
