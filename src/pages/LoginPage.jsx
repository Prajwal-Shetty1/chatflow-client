import React, { useState,useContext } from 'react'
import "./LoginPage.css";
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("SignUp")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const navigate = useNavigate();

  const {login} = useContext(AuthContext);
const handleSubmit = async (e) => {
  e.preventDefault();

  if (currentState === "SignUp" && !isDataSubmitted) {
    setIsDataSubmitted(true);
    return;
  }
  const payload =
    currentState === "SignUp"
      ? { fullName, email, password, bio }
      : { email, password }; // ✅ FIX for login
  const success = await login(
    currentState === "SignUp" ? "register" : "login",
    payload
  );

  if (success) navigate("/");
};

  return (
    <div className="page">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="wrapper">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="left-grid" />
          <div className="left-glow" />

          {/* Brand */}
          <div className='brand'>
            <img src={assets.logo} alt="logo" />
          </div>

          {/* Hero */}
          <div className="left-hero">
            <div className="chat-bubbles">
              <div className="cb">
                <div className="cb-avatar a">A</div>
                <div className="cb-bubble incoming">Hey! What's up? 👋</div>
              </div>
              <div className="cb">
                <div className="cb-avatar b">B</div>
                <div className="cb-bubble outgoing">Not much, just exploring ChatFlow!</div>
              </div>
              <div className="cb">
                <div className="cb-avatar a">A</div>
                <div className="cb-bubble incoming">It's pretty great, right? 🚀</div>
              </div>
              <div className="cb">
                <div className="cb-avatar b">B</div>
                <div className="cb-bubble outgoing typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>

            <div className="left-tagline">
              Messages that<br /><span>flow naturally.</span>
            </div>
            <p className="left-desc">
              Real-time conversations designed to feel effortless, wherever you are.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat">
              <div className="stat-num">2M+</div>
              <div className="stat-label">Active users</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num">E2E</div>
              <div className="stat-label">Encrypted</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">

          {/* Tabs */}
          <div className="tab-row">
            <button
              className={`tab-btn ${currentState === 'SignUp' ? 'active' : ''}`}
              onClick={() => { setCurrentState('SignUp'); setIsDataSubmitted(false) }}
            >Create account</button>
            <button
              className={`tab-btn ${currentState === 'Login' ? 'active' : ''}`}
              onClick={() => { setCurrentState('Login'); setIsDataSubmitted(false) }}
            >Sign in</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {/* Step dots (SignUp only) */}
            {currentState === 'SignUp' && (
              <div className="step-dots">
                <div className={`sdot ${!isDataSubmitted ? 'active' : ''}`} />
                <div className={`sdot ${isDataSubmitted ? 'active' : ''}`} />
              </div>
            )}

            {/* Title */}
            <h2 className="form-title">
              {currentState === 'SignUp'
                ? (isDataSubmitted ? 'Almost there!' : 'Join ChatFlow')
                : 'Welcome back'}
            </h2>
            <p className="form-subtitle">
              {currentState === 'SignUp'
                ? (isDataSubmitted ? 'Tell your future friends about yourself.' : 'Start connecting with people around the world.')
                : 'Sign in to continue your conversations.'}
            </p>

            <div className="field-group">
              {/* Step 1 fields */}
              {currentState === 'SignUp' && !isDataSubmitted && (
                <div className="field-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input className="field-input" type="text" placeholder="Full name"
                    value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
              )}

              {!isDataSubmitted && (
                <>
                  <div className="field-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <input className="field-input" type="email" placeholder="Email address"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="field-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input className="field-input" type="password"
                      placeholder={currentState === 'SignUp' ? "Create password" : "Password"}
                      value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </>
              )}

              {/* Step 2 — bio */}
              {currentState === 'SignUp' && isDataSubmitted && (
                <textarea className="field-textarea" rows={4}
                  placeholder="Write a short bio..."
                  value={bio} onChange={e => setBio(e.target.value)} />
              )}
            </div>

            <button type="submit" className="submit-btn">
              {currentState === 'Login'
                ? 'Sign In →'
                : isDataSubmitted ? 'Complete Setup →' : 'Continue →'}
            </button>

            <div className="terms-row">
              <input type="checkbox" className="terms-cb" />
              <p className="terms-text">
                By continuing you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage