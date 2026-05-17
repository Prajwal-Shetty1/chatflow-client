import React from 'react';
import './CallModal.css';

const CallModal = ({ incomingCall, onAccept, onReject }) => {
     if (!incomingCall) return null;

    const { from, callType } = incomingCall;
    
    return (
        <>
            <div className='overlay'>
                <div className='card'>

                    {/*Avatar*/}
                    <div className="avatar-wrap">
                        <div className="pulse-ring" />
                        {from?.profilePic ? (
                            <img className="avatar" src={from.profilePic}
                                onError={(e) => { e.target.style.display = "none"; }} alt="" />
                        ) : (
                            <div className="avatar-letter">
                                {from?.fullName?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    <p className="name">{from?.fullName || "Someone"}</p>
                    <p className="type">
                        {callType === "video" ? "📹 Incoming video call" : "📞 Incoming audio call"}
                    </p>
                    <div className="actions">
                        <button className="cm-btn btn-reject" onClick={onReject}>
                            ✕ Decline
                        </button>
                        <button className="cm-btn btn-accept" onClick={onAccept}>
                            ✓ Accept
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CallModal;
