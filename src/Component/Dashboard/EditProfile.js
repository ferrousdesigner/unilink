import React, { useState, useEffect } from "react";
import { DB } from "../../firebaseConfig";
import Button from "../Button/Button";

export default function EditProfile({ profile, onBack, user, onSave }) {
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const [status, showStatus] = useState();
  const [uploading, setUploading] = useState()
  const [file, setFile] = useState()
  const [isAvail, setIsAvail] = useState();
  const [unilink, setUnilink] = useState();
  const [dp, setDp] = useState();
  useEffect(() => {
    setName(profile?.name);
    setBio(profile?.bio);
    setUnilink(profile?.unilink);
    setDp(profile?.dp);
  }, [profile]);
  const validateUniLink = () => {
    DB.collection("taken_links")
      .doc("links_array")
      .get()
      .then((doc) => {
        // console.log("Dco");
        if (doc.exists) {
          let taken = doc.data();
          let newLinks = [...taken?.links];
          if (newLinks.includes(unilink)) {
            setIsAvail(false)
          } else {
            setIsAvail("avail");
          }
        }
      });
  };
  const saveProfile = () => {
    DB.collection("user_data")
      .doc(user?.uid)
      .update({
        name,
        bio,
        unilink,
        dp,
      })
      .then(() => onSave());
  };
  const uploadFile = () => {
    setUploading(true)

  }
  const getURLFromFile = (file) => {
    const objectURL = URL.createObjectURL(file);
    return objectURL
  }
  return (
    <div>
      <h1>Edit Profile</h1>
      <div className="flex" style={{ paddingTop: "3rem", opacity: uploading ? '0.4' : '', pointerEvents: uploading ? 'none' : '' }}>
        <img
          src={file ? getURLFromFile(file) : dp}
          alt="x"
          className="round-img"
          width={140}
        />
        <div className="flex" style={{ flexDirection: "column" }}>
          {!file && (
            <div className="input-wrapper">
              <input
                type="file"
                onInput={(e) => setFile(e.target.files[0])}
                accept="image/png, image/jpeg"
              />
              <button className="header-btn" style={{ width: 180 }}>
                Update
              </button>
            </div>
          )}
          {file && (
            <button
              className="header-btn"
              onClick={() => uploadFile()}
              style={{ width: 180 }}
            >
              Upload
            </button>
          )}

          <br />
          <button
            className="header-btn-alt"
            onClick={() => setFile()}
            style={{ width: 180 }}
          >
            Remove
          </button>
        </div>
      </div>
      <fieldset>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </fieldset>
      <fieldset>
        <label>Bio</label>
        <input value={bio} onChange={(e) => setBio(e.target.value)} />
      </fieldset>
      <fieldset>
        <label>UNILINK</label>
        <input
          value={unilink}
          onBlur={() => validateUniLink()}
          onChange={(e) => {
            setIsAvail("check");
            showStatus(true);
            setUnilink(e.target.value);
          }}
        />
        {status && (
          <div>
            {isAvail === "avail" ? (
              <span className="avail-chip">
                <span
                  className="fas fa-check-circle"
                  style={{ paddingRight: "0.6rem" }}
                />{" "}
                Available
              </span>
            ) : isAvail === "check" ? (
              <button className="header-btn">Check Availability</button>
            ) : (
              <span className="unavail-chip">
                <span
                  className="fas fa-times-circle"
                  style={{ paddingRight: "0.6rem" }}
                />{" "}
                Unavailable
              </span>
            )}
          </div>
        )}
      </fieldset>
      <br />
      <br />
      <br />
      <Button
        onClick={() => saveProfile()}
        disabled={!(name && unilink && isAvail && bio)}
      >
        Save
      </Button>
      <Button accent onClick={() => onBack()}>
        Back
      </Button>
    </div>
  );
}
