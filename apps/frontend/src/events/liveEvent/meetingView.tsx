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
    const [seenNames, setSeenNames] = useState(new Set());



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
        // Reset the seen names if participants change
        setSeenNames(new Set());
    }, [participants]);

    useEffect(() => {
        if (userMatch?.roomId) {
            setTimeout(() => {
                setJoined("JOINING");
                join();
            }, 3000);
        }
    }, [userRoom, userMatch?.roomId])

    const uniqueParticipantsKeys = Array.from(new Set([...Array.from(participants.keys())].map((key) => participants.get(key)?.displayName ?? '')));

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div>
                {uniqueParticipantsKeys.map((displayName) => {
                    const participant = Array.from(participants).find(([key, value]) => value?.displayName === displayName);
                    return (
                        <ParticipantView
                            participantId={participant?.[0] ?? ''}
                            key={participant?.[0] ?? ''}
                            setMeetingId={onMeetingLeave}
                            isSelfView={`(${userRoom?.email})` === `${displayName}`}
                        />
                    );
                })}
                {uniqueParticipantsKeys.length <= 1 && <DateJoiningLoading matchName={userMatch?.email ?? 'N/A'} />}
            </div>

        </div>
    );
}