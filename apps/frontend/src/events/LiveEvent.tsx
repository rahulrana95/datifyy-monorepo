// @ts-expect-error
import { VideoSDK, VideoCall } from "videosdk"; // Import VideoSDK
import { Box, Typography, Button } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { useUserStore } from "../stores/userStore";
import Login from "../login-signup/LiveEventLogin";
//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string = process.env.REACT_APP_VIDEO_TOKEN ?? "";

// API call to create a meeting
export const createMeeting = async ({ token }: { token: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
    }),
  });
  //Destructuring the roomId from the response
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};

// Function to create multiple meeting rooms for each user
export const createMultipleMeetings = async (
  userEmails: string[]
): Promise<void> => {
  try {
    const roomPromises = userEmails.map(async (email) => {
      const roomId = await createMeeting({ token: authToken }); // Create a meeting for each user
      return { email, roomId }; // Return an object with the email and roomId
    });

    // Wait for all the room creations to complete
    const roomDetails = await Promise.all(roomPromises);

    console.log(roomDetails);

    // Send the room details to the backend
    const response = await fetch("/api/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomDetails), // [{ email, roomId }, ...]
    });

    if (!response.ok) {
      throw new Error("Failed to save rooms in the database");
    }

    console.log("Rooms created and saved successfully", await response.json());
  } catch (error) {
    console.error("Error creating multiple meetings:", error);
  }
};

function JoinScreen({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (meeting?: string) => void;
}) {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const onClick = async () => {
    getMeetingAndToken(meetingId);
  };
  const {isAuthenticated}  = useUserStore();

  if (!isAuthenticated) {
      return <Login/>
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={participantId}>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"200px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
    </div>
  );
}

function MeetingView({
  onMeetingLeave,
  meetingId,
}: {
  onMeetingLeave: () => void;
  meetingId: string;
}) {
  const [joined, setJoined] = useState<string | null>(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          <Controls />
          //For rendering all the participants in the meeting
          {[...Array.from(participants.keys())].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

function LiveEvent() {
  const [meetingId, setMeetingId] = useState<string>("");

  //Getting the meeting id by calling the api we just wrote
  const getMeetingAndToken = async (id?: string) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId("");
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
        debugMode: false,
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default LiveEvent;
