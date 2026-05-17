import React, { useState, useRef } from "react";

const VideoCall = ({
    socket, currentUser, outgoingCall, callInfo, onEndCall,
}) => {

    const [callAccepted, setCallAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const timerRef = useRef(null);

    // Remote user info for the UI
    const remoteUser = outgoingCall
        ? { fullName: outgoingCall.fullName, profilePic: outgoingCall.profilePic }
        : callInfo?.from;
    const isVideoCall = callType === "video";

    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");

        return `${m}:${sec}`;
    };

    const toggleMute = () => { };

    const toggleVideo = () => { };

    const handleEndCall = () => { };

    return (
        <div className={`vc-container ${!isVideoCall ? "vc-audio-mode" : ""}`}>

            {isVideoCall ? (
                <>
                    {/* Remote video */}
                    <video ref={remoteVideoRef} className="vc-remote" autoPlay playsInline />

                    {/* Local video */}
                    <video ref={localVideoRef} className="vc-local" autoPlay playsInline muted />
                </>
            ) : (

                /* Audio-only screen */
                <div className="vc-audio-screen">

                    {remoteUser?.profilePic ? (
                        <img className="vc-audio-avatar" src={remoteUser.profilePic} alt="" />
                    ) : (
                        <div className="vc-audio-letter">
                            {remoteUser?.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}

                    <p className="vc-audio-name">
                        {remoteUser?.fullName || "User"}
                    </p>

                    <p className="vc-audio-status">
                        {callAccepted
                            ? `🔊 ${formatTime(callDuration)}`
                            : "⏳ Calling..."}
                    </p>

                </div>
            )}
            {/* Top bar — name + timer (used for video calls) */}
            <div className="vc-topbar">
                <p className="vc-topbar-name">{remoteUser?.fullName || "User"}</p>
                <p className="vc-topbar-status">
                    {callAccepted ? formatTime(callDuration) : "Connecting..."}
                </p>
            </div>
            {/* Controls */}
            <div className="vc-controls">
                <button
                    className={`vc-btn ${isMuted ? "vc-btn-on" : ""}`}
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? "🔇" : "🎙️"}
                    <span>{isMuted ? "Unmute" : "Mute"}</span>
                </button>

                {isVideoCall && (
                    <button
                        className={`vc-btn ${isVideoOff ? "vc-btn-on" : ""}`}
                        onClick={toggleVideo}
                        title={isVideoOff ? "Camera on" : "Camera off"}
                    >
                        {isVideoOff ? "📷" : "📹"}
                        <span>{isVideoOff ? "Cam on" : "Cam off"}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoCall;