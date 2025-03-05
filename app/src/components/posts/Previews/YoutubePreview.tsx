import React from "react";
import "./YoutubePreview.css";

const YoutubePreview = () => {
  let previewContent = {
    video_url : "",
    thumbnail_url : "",
    title : "",
    views : "",
    description : "",
    tags : [],
    hashtags : [],
    owner : {
      name : "",
      subscribers : "",
      image : ""
    },
    comments : [],
  }
  return (
    <div className="youtube_preview w-full">
      <div className="mockup-browser bg-base-300 border">
        <div className="mockup-browser-toolbar">
          <div className="input">https://www.youtube.com/watch?v=postid</div>
        </div>
        <div className="bg-base-200 flex justify-center">
          <div>
            {/* Youtube Navigation */}
            <nav className="flex-div">
              <div className="nav-left flex-div">
                <img
                  src="/images/preview/youtube/menu.png"
                  className="menu-icon"
                  alt="Menu"
                />
                <img
                  src="/images/preview/youtube/logo.png"
                  className="logo"
                  alt="Logo"
                />
              </div>
              <div className="nav-middle flex-div">
                <div className="search-box flex-div rounded-full">
                  <input type="text" placeholder="Search.." className="h-full w-full ring-0"/>
                  <img src="/images/preview/youtube/search.png" alt="Search" />
                </div>
                <img
                  src="/images/preview/youtube/voice-search.png"
                  className="mic-icon"
                  alt="Voice Search"
                />
              </div>
              <div className="nav-right flex-div">
                <img src="/images/preview/youtube/upload.png" alt="Upload" />
                <img src="/images/preview/youtube/more.png" alt="More" />
                <img
                  src="/images/preview/youtube/notification.png"
                  alt="Notifications"
                />
                <img
                  src="/images/preview/youtube/nilava.jpeg"
                  className="user-icon"
                  alt="User Profile"
                />
              </div>
            </nav>

            {/* Youtube Container */}
            <div className="container play-container">
              <div className="row">
                <div className="play-video">
                  <video controls autoPlay className="rounded-lg">
                    <source
                      src="/images/preview/youtube/thumbnail2-video.mp4"
                      type="video/mp4"
                    />
                  </video>

                  <div className="tags">
                    <a href="#">#gulabiaankhein</a> <a href="#">#busking</a>{" "}
                    <a href="#">#reactions</a>
                  </div>
                  <h3>
                    Indian boy singing "Gulabi Aankhein" on streets of Jaipur!!
                  </h3>
                  <div className="play-video-info">
                    <p>355,728 views • Sep 9, 2019</p>
                    <div>
                      <a href="#">
                        <img
                          src="/images/preview/youtube/like.png"
                          alt="Like"
                        />{" "}
                        18K
                      </a>
                      <a href="#">
                        <img
                          src="/images/preview/youtube/dislike.png"
                          alt="Dislike"
                        />{" "}
                        257
                      </a>
                      <a href="#">
                        <img
                          src="/images/preview/youtube/share.png"
                          alt="Share"
                        />{" "}
                        SHARE
                      </a>
                      <a href="#">
                        <img
                          src="/images/preview/youtube/save.png"
                          alt="Save"
                        />{" "}
                        SAVE
                      </a>
                    </div>
                  </div>
                  <hr />
                  <div className="owner">
                    <img
                      src="/images/preview/youtube/thumbnail1-owner.jpg"
                      alt="Owner"
                    />
                    <div>
                      <p>Tron Wilder</p>
                      <span>37.7K subscribers</span>
                    </div>
                    <button type="button">Subscribe</button>
                  </div>

                  <div className="vid-des">
                    <p>
                      Here's a video of me performing "Gulabi Aankhein" at GT
                      Central in Jaipur, Rajasthan. <br />
                      Instagram:{" "}
                      <a
                        href="https://www.instagram.com/tron_wilder/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @tron_wilder
                      </a>
                    </p>
                    <hr />
                    <div className="cmnt">
                      <h4>594 Comments</h4>
                      <img src="/images/preview/youtube/menu.png" alt="Menu" />
                      <span>SORT BY</span>
                    </div>

                    <div className="add-cmnt">
                      <img
                        src="/images/preview/youtube/nilava.jpeg"
                        alt="User"
                      />
                      <input type="text" placeholder="Add a Public Comment" />
                    </div>

                    {[1, 2, 3].map((index) => (
                      <div className="old-cmnt" key={index}>
                        <img
                          src="/images/preview/youtube/Harpreet.jpg"
                          alt="Comment User"
                        />
                        <div>
                          <h3>
                            Atinder Kumar <span>2 Days ago</span>
                          </h3>
                          <p>
                            Look at Elon’s expression and body language at the
                            mention of Ratan Tata...
                          </p>
                          <div className="cmnt-react">
                            <img
                              src="/images/preview/youtube/like.png"
                              alt="Like"
                            />
                            <span>1.2K</span>
                            <img
                              src="/images/preview/youtube/dislike.png"
                              alt="Dislike"
                            />
                            <span>REPLY</span>
                            <div>• View 9 Replies</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="right-sidebar">
                  {[19, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
                    <div className="side-video-list" key={num}>
                      <a href="#" className="small-thumbnail ">
                        <img
                          src={`/images/preview/youtube/thumbnail${num}.png`}
                          alt={`Thumbnail ${num}`}
                          className="rounded-lg"
                        />
                      </a>
                      <div className="vid-info ">
                        <a href="#" className="leading-[1.2]">Lorem ipsum dolor sit amet.</a>
                        <p className="text-xs">Avalin Vines</p>
                        <p className="text-xs">1.1M Views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePreview;
