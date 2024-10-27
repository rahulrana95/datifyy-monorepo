import React, { useEffect, useState } from 'react';
// @ts-expect-error
import { VideoSDK, VideoCall } from 'videosdk'; // Import VideoSDK
import { Box, Typography, Button } from '@mui/material';

//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string = process.env.REACT_APP_VIDEO_SDK_KEY ?? '';

// API call to create a meeting
export const createMeeting = async ({ token }: { token: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};

const SpeedDating: React.FC = () => {
  const [currentParticipant, setCurrentParticipant] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(600); // 10 minutes in seconds

  useEffect(() => {
    // Fetch participants from the server when the component mounts
    fetchParticipants();

    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      } else {
        rotateParticipant();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const fetchParticipants = async () => {
    // Call your backend to get the list of participants
    const response = await fetch('/api/v1/speed-dating/participants');
    const data = await response.json();
    setParticipants(data); // Set participants based on response
    setCurrentParticipant(data[0]); // Set the first participant
  };

  const rotateParticipant = () => {
    const currentIndex = participants.indexOf(currentParticipant!);
    const nextIndex = (currentIndex + 1) % participants.length;
    setCurrentParticipant(participants[nextIndex]);
    setTimer(600); // Reset the timer
  };

  const startVideoCall = () => {
    VideoSDK.init({ key: 'YOUR_VIDEOSDK_KEY' }); // Initialize VideoSDK
    const call = new VideoCall('3rahul4@gmail.com', currentParticipant);
    call.start(); // Start the video call with the current participant
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Speed Dating Session</Typography>
      <Typography variant="h6">Current Participant: {currentParticipant}</Typography>
      <Typography variant="h6">Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</Typography>
      <Button variant="contained" onClick={startVideoCall}>Start Call</Button>
      {/* Display video call UI here */}
    </Box>
  );
};

export default SpeedDating;
