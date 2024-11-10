import React from "react";
import { useEffect, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./participantView";
import DateJoiningLoading from "./dateJoiningLoading";
import { useVideoRoomStore } from "../../stores/videoRoomStore";

export default function MeetingView({
    onMeetingLeave,
    meetingId,
}: {
    onMeetingLeave: () => void;
    meetingId: string;
}) {
    const [joined, setJoined] = useState<string | null>(null);
    const { userMatch, userRoom } = useVideoRoomStore();
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

    useEffect(() => {
        if (userMatch?.roomId) {
            setJoined("JOINING");
            join();
        }
    }, [userRoom, userMatch?.roomId])

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div>
                {[...Array.from(participants.keys())].map((participantId) => (
                    <ParticipantView
                        participantId={participantId}
                        key={participantId}
                        setMeetingId={onMeetingLeave}
                    />
                ))}
                {[...Array.from(participants.keys())].length <= 1 && <DateJoiningLoading matchName={userMatch?.email ?? 'N/A'} />}
            </div>

        </div>
    );
}