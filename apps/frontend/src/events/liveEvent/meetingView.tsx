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
            setJoined("JOINING");
            join();
        }
    }, [userRoom, userMatch?.roomId])

    const uniqueParticipants = [...Array.from(participants.keys())].filter((participantId) => {
        const displayName = participants.get(participantId)?.displayName;

        if (displayName && seenNames.has(displayName)) {
            return false;
        }

        seenNames.add(displayName);
        return true;
    });

    console.log([...Array.from(participants.keys())])
    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div>
                {[...Array.from(participants.keys())].map((participantId) => {
                    const displayName = participants.get(participantId)?.displayName;

                    // Skip rendering if the display name is already seen
                    if (displayName && !seenNames.has(displayName)) {
                        // Mark this display name as seen
                        seenNames.add(displayName);
                    }

                    return (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                            setMeetingId={onMeetingLeave}
                        />
                    );
                })}
                {uniqueParticipants.length <= 1 && <DateJoiningLoading matchName={userMatch?.email ?? 'N/A'} />}
            </div>

        </div>
    );
}