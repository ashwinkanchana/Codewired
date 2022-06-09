import React from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import './index.css'

const VideoGrid = ({ users, tracks }) => {
  return (
    <>
   
       <div id="videos">
          <AgoraVideoPlayer style={{height: '95%', width: '95%'}} className='vid' videoTrack={tracks[1]} />
          {users.length > 0 &&
            users.map((user) => {
              if (user.videoTrack) {
                return (
                  <AgoraVideoPlayer style={{height: '95%', width: '95%'}} className='vid' videoTrack={user.videoTrack} key={user.uid} />
                );
              } else return null;
            })}
        </div>
    </>
  );
};

export default VideoGrid;
