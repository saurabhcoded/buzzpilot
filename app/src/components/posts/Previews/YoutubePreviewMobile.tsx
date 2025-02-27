import React from "react";
import { resources } from "../../../_constants/data";

const YoutubePreviewMobile = ({ postData }) => {
  return (
    <div>
      {/* Mockup Phone Container */}
      <div className="mockup-phone mx-auto w-fit mb-4">
        <div className="camera"></div>
        <div className="display">
          {postData?.document && (
            <video
              src={URL.createObjectURL(postData?.document)}
              controls
              autoPlay
            />
          )}
          <div className="artboard artboard-demo phone-1 flex justify-center items-center bg-white">
            {postData.document ? (
              <img
                src={URL.createObjectURL(postData.document)}
                alt="Post Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src={resources.youtubeDemo}
                alt="Default Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePreviewMobile;
