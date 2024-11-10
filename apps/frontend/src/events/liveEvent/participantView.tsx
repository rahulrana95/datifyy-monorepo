import React, { useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { Card, CardContent, Typography, Avatar, Box, IconButton } from "@mui/material";


export default function ParticipantView({ participantId, setMeetingId, isSelfView }: { participantId: string; setMeetingId: () => void, isSelfView: boolean }) {
    const micRef = useRef<HTMLAudioElement>(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
        useParticipant(participantId);
    const { leave, toggleMic, toggleWebcam } = useMeeting();


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

    const endCall = () => {
        leave();
        setMeetingId();
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', mb: 2, bgcolor: '#f5f5f5', borderRadius: '12px' }}>
            <Box sx={{ flexShrink: 0, m: 2 }}>
                {/* Display participant's avatar */}
                <Avatar sx={{ width: 56, height: 56 }} alt={displayName} src="" />
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {displayName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', marginTop: 1 }}>
                    Webcam: {webcamOn ? "ON" : "OFF"} | Mic: {micOn ? "ON" : "OFF"}
                </Typography>

                {/* Video Stream */}
                {webcamOn && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <ReactPlayer
                            playsinline
                            pip={false}
                            light={false}
                            controls={true}
                            muted={true}
                            playing={true}
                            url={videoStream}
                            height={"200px"}
                            width={"300px"}
                            onError={(err) => {
                                console.log(err, "participant video error");
                            }}
                        />
                    </Box>
                )}

                {/* Mic audio */}
                <audio ref={micRef} autoPlay muted={isLocal} />
            </CardContent>
            <Box sx={{ alignSelf: 'center', ml: 2 }}>
                {/* Option to mute/unmute or turn off webcam */}
                {isSelfView && <><IconButton sx={{ color: 'green' }} onClick={() => leave()}>
                    <Typography variant="body2">End the date</Typography>
                </IconButton>
                    <IconButton sx={{ color: micOn ? 'green' : 'red' }} onClick={() => toggleMic()}>
                        <Typography variant="body2">{micOn ? "Mute" : "Unmute"}</Typography>
                    </IconButton>
                    <IconButton sx={{ color: webcamOn ? 'green' : 'red' }} onClick={() => toggleWebcam()}>
                        <Typography variant="body2">{webcamOn ? "Turn Off Webcam" : "Turn On Webcam"}</Typography>
                    </IconButton>
                </>
                }
            </Box>
        </Card>
    );
}