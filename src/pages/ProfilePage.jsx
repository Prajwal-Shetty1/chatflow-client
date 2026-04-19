import React, { useState } from 'react'
import "./ProfilePage.css";
import assets from '../assets/assets';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi Everyone, I am Using ChatFlow");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* LEFT SIDE */}
        <div className="profile-left">
          <form className="profile-form" onSubmit={onSubmitHandler}>
            <h1>Profile Details</h1>

            <label htmlFor="avatar" className="avatar-upload">
              <input
                onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png,.jpg,.jpeg" hidden />
              <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar" className="avatar-img" />
              <span>Upload Profile Image</span>
            </label>

            <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Name" />
            <textarea rows={4} onChange={(e) => setBio(e.target.value)} value={bio} placeholder="Enter bio" />
            <button type="submit">Save</button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          <img src={assets.logo_icon} alt="ChatFlow Logo" className="logo-img" />
          <div className="profile-right-text">
            <h2>ChatFlow</h2>
            <p>Set up your profile and start connecting with people around you.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;