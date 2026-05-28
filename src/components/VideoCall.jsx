import SimplePeer from "simple-peer/simplepeer.min.js";
import React, { useState, useRef, useEffect } from "react";
import "./VideoCall.css";

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

    const callType = callInfo?.callType || outgoingCall?.callType || "video";
    const isVideoCall = callType === "video";

    // Remote user info for the UI
    const remoteUser = outgoingCall
        ? { fullName: outgoingCall.fullName, profilePic: outgoingCall.profilePic }
        : callInfo?.from;

    /* ── Start timer once connected */
    useEffect(() => {
        if (callAccepted) {
            timerRef.current = setInterval(() => {
                setCallDuration((d) => d + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [callAccepted]);

    /*"When VideoCall component opens,start the call."
    When leaving call screen,clean everything." */
    useEffect(() => {
        startCall();
        return () => cleanup();
    }, []);

    const handleRemoteEnd = () => {
        cleanup();
        onEndCall();
    };

    //other user ending call
    useEffect(() => {
        socket.on("call-ended", handleRemoteEnd);
        return () => socket.off("call-ended", handleRemoteEnd);
    }, [])

    /* ── Get camera/mic then create peer connection ── */
    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: isVideoCall,
                audio: true
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            if (outgoingCall) {
                createPeer(stream, true);  //caller
            } else {
                createPeer(stream, false, callInfo.signal); //receiver
            }
        } catch (error) {
            console.log("getUserMedia error:", error);
            alert("Could not access camera/microphone.\nPlease allow permissions and try again."
            );
            onEndCall();
        }
    }
    /* ── Create simple-peer instance ─── */
    const createPeer = (stream, initiator, incomingSignal = null) => {
        const peer = new SimplePeer({ initiator, trickle: false, stream });
        peer.on("signal", (signal) => {
            if (initiator) {
                // Caller → send offer to receiver
                socket.emit("call-user", {
                    to: outgoingCall.to,
                    from: { id: currentUser.id, fullName: currentUser.fullName, profilePic: currentUser.profilePic },
                    signal,
                    callType,
                });
                // Caller → wait for answer
                socket.once("call-accepted", ({ signal: answerSignal }) => {
                    if (!peer || peer.destroyed) return;
                    peer.signal(answerSignal);
                    setCallAccepted(true);
                });
                socket.once("call-rejected", () => {
                    alert(`${outgoingCall.fullName} declined the call.`);
                    cleanup();
                    onEndCall();
                });
            } else {
                // Receiver → send answer to caller
                socket.emit("call-accepted", {
                    to: callInfo.from.id,
                    signal
                });
                setCallAccepted(true);
            }
        });
        peer.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        });
        peer.on("error", (err) => console.log("Peer error:", err));
        peer.on("close", () => {
            cleanup();
            onEndCall();
        });
        if (!initiator && incomingSignal && peer) {
            peer.signal(incomingSignal);
        }
        peerRef.current = peer;
    }
    /* ── Cleanup ─── */
    const cleanup = () => {
        clearInterval(timerRef.current);
        peerRef.current?.destroy();
        peerRef.current = null;
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
    };

    /* ── Format timer ────*/
    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");

        return `${m}:${sec}`;
    };
    /* ── Controls ──── */
    const toggleMute = () => {
        if (!localStreamRef.current) return;
        localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
        setIsMuted((p) => !p);
    };

    const toggleVideo = () => {
        if (!localStreamRef.current || !isVideoCall) return;
        localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
        setIsVideoOff((p) => !p);
    };

    const handleEndCall = () => {
        const toId = outgoingCall?.to || callInfo?.from?.id;
        if (toId) socket.emit("call-ended", { to: toId });
        cleanup();
        onEndCall();
    };

    return (
        <div className={`vc-container ${!isVideoCall ? "vc-audio-mode" : ""} ${callAccepted ? "vc-connected" : ""}`}>

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

                    <p className={`vc-audio-status ${callAccepted ? "vc-status-connected" : "vc-status-calling"}`}>
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
                <button className="vc-btn vc-btn-end" onClick={handleEndCall} title="End Call">
                    📵
                    <span>End</span>
                </button>
            </div>
        </div>
    );
};

export default VideoCall;