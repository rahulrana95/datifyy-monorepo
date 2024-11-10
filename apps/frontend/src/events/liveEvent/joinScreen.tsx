import React from "react";
import { useState } from "react";
import { useUserStore } from "../../stores/userStore";
// import Login from "../../auth/Login";
// import { useUserStore } from "../../stores/userStore";

export default function JoinScreen({
    getMeetingAndToken,
}: {
    getMeetingAndToken: (meeting?: string) => void;
}) {
    const [meetingId, setMeetingId] = useState<string | undefined>();
    const onClick = async () => {
        getMeetingAndToken(meetingId);
    };
    const { isAuthenticated } = useUserStore();

    // if (!isAuthenticated) {
    //   return <Login />
    // }
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