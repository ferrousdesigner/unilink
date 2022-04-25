import React, { useState, useEffect } from "react";
import { DB, storage } from "../../firebaseConfig";
import Button from "../Button/Button";
import { clean } from "../Utils";
import { BackArrow } from './EditAccount';

export default function EditProfile({ profile, onBack, user, onSave }) {
  const [name, setName] = useState();
  const [busy, setBusy] = useState();
  const [changed, setChanged] = useState();
  const [bio, setBio] = useState();
  const [status, showStatus] = useState();
  const [uploading, setUploading] = useState();
  const [file, setFile] = useState();
  const [isAvail, setIsAvail] = useState();
  const [unilink, setUnilink] = useState();
  const [dp, setDp] = useState();
  useEffect(() => {
    setName(profile?.name);
    setBio(profile?.bio);
    setUnilink(profile?.unilink);
    setDp(profile?.dp);
  }, [profile, dp]);
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
            setIsAvail(false);
          } else {
            setIsAvail("avail");
          }
        }
      });
  };
  const saveProfile = () => {
    setBusy(true)
    DB.collection("user_data")
      .doc(user?.uid)
      .update({
        name: clean("profile.name", name),
        bio: clean("profile.bio", bio),
        unilink: clean("profile.unilink", unilink),
        dp,
      })
      .then(() => {
        setBusy();
        onSave()});
  };
  const uploadFile = () => {
    setUploading(true);
    var name = new Date().getTime() + "-" + file.name;
    // make ref to your firebase storage and select images folder
    var storageRef = storage.ref(`user_dps/${name}`);
    // put file to Firebase
    var uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      () => {},
      (err) => console.log(err),
      async () => {
        let backgroundURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log("backgroundURL", backgroundURL);
        setFile(null);
        setUploading(false);
        DB.collection("user_data")
          .doc(user?.uid)
          .update({
            dp: backgroundURL,
          })
          .then(() => onSave());
      }
    );
  };
  const getURLFromFile = (file) => {
    const objectURL = URL.createObjectURL(file);
    return objectURL;
  };
  return (
    <div>
      <h1>
        <BackArrow onClick={() => onBack()} />
        Edit Profile
      </h1>
      <div
        className="flex"
        style={{
          paddingTop: "3rem",
          opacity: uploading ? "0.4" : "",
          pointerEvents: uploading ? "none" : "",
        }}
      >
        <img
          src={file ? getURLFromFile(file) : dp}
          alt="x"
          className="round-img"
          width={140}
        />
        <div
          className="flex"
          style={{ flexDirection: "column", padding: "1rem" }}
        >
          {!file && (
            <div className="input-wrapper">
              <input
                type="file"
                onInput={(e) => setFile(e.target.files[0])}
                accept="image/png, image/jpeg"
              />
              <button
                className="header-btn"
                style={{ width: 170, paddingLeft: 20 }}
              >
                Update
              </button>
            </div>
          )}
          {file && (
            <button
              className="header-btn"
              onClick={() => uploadFile()}
              style={{ width: 170, paddingLeft: 20 }}
            >
              Upload
            </button>
          )}

          <br />
          {file && (
            <button
              className="header-btn-alt"
              onClick={() => setFile()}
              style={{ width: 170, paddingLeft: 20 }}
            >
              Remove
            </button>
          )}
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
        <label>Primafacie Link</label>
        <input
          value={unilink}
          onBlur={() => validateUniLink()}
          onChange={(e) => {
            setChanged(true);
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
        busy={busy}
        disabled={
          !(
            name &&
            ((changed && unilink && isAvail === 'avail') ||
              (!changed && unilink)) &&
            bio
          )
        }
      >
        Save
      </Button>
    </div>
  );
}
