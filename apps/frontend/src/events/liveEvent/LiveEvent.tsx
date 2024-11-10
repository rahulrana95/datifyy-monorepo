// @ts-expect-error
import { VideoSDK, VideoCall } from "videosdk"; // Import VideoSDK
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { useUserStore } from "../../stores/userStore";
import useAuthStore from "../../stores/authStore";
import { authToken, useVideoRoomStore } from "../../stores/videoRoomStore";
import { useLocation, useParams } from "react-router-dom";
import WaitingScreen from "./waitScreen";
import ParticipantView from "./participantView";
import DateJoiningLoading from "./dateJoiningLoading";
import MeetingView from "./meetingView";
//This is the Auth token, you will use it to generate a meeting and connect to it
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function LiveEvent() {
  const [meetingId, setMeetingId] = useState<string>("");
  const { user } = useAuthStore();
  const { getNextMatch, userMatch, createMeeting, getUserRooms, userRoom } = useVideoRoomStore();
  const { eventId } = useParams();
  const query = useQuery();
  const emailParam = query.get("email"); // Replace 'paramName' with your query parameter

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId("");
    const email = emailParam || user?.email || '';
    getNextMatch((eventId ?? ''), email);
  };

  useEffect(() => {
    const email = emailParam || user?.email || '';
    getUserRooms(Number(eventId ?? ''), email);


  }, [user?.email, eventId]);

  useEffect(() => {
    const email = emailParam || user?.email || '';

    if (userRoom?.gender === 'female' && userRoom?.email) {
      setMeetingId(userRoom.roomId);
    }
    getNextMatch((eventId ?? ''), email);
  }, [userRoom])

  useEffect(() => {

    if (userMatch?.roomId && userRoom?.gender === 'male') {
      setMeetingId(userMatch.roomId);
    }
  }, [userMatch?.roomId, userRoom])


  return authToken && meetingId && userRoom?.email ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: `(${userRoom?.email})`,
        debugMode: false,
        maxResolution: 'hd'
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <WaitingScreen />
  );
}

export default LiveEvent;
