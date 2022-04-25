import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Button from "../Button/Button";
import { DB } from "../../firebaseConfig";
import { Smoother } from "../../App";
import Dialog from "./Dialog";
import EditAccount from "./EditAccount";
import EditProfile from "./EditProfile";
import logo from "../../images/unilink.png";
import { copyTextToClipboard } from "../Utils";
const appPath =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "https://www.google.com/";

export function Profile({ isAdmin, user, onEdit, profile }) {
  // const profile = {
  //   name: "Ferous designer",
  //   bio: "I'm a developer in lucknow base of react js",
  //   unilink: "/ferrousdesigner",
  //   dp: user?.photoURL,
  // };
  const { name, bio, dp, unilink } = profile || {};
  return (
    <div>
      <div className="card flex" style={{ borderRadius: "1rem 1rem 0 0" }}>
        <img src={dp} alt="dp" />
        <div className="desc">
          <h3>{name}</h3>
          <p>{bio}</p>
        </div>
        {isAdmin && (
          <div>
            <span
              className="fas fa-pen-to-square"
              onClick={() => onEdit("profile", profile)}
            />
          </div>
        )}
      </div>
      {isAdmin && <div style={{ color: "white" }} className="unilink-container">
        <span className="chip">
          UNILINK
        </span>
        <a rel="noopener noreferrer" href={appPath + unilink} target={"_blank"}>
          {unilink}
        </a>
        <span
          className="fas fa-copy"
          onClick={() => copyTextToClipboard(appPath + unilink)}
        />
      </div>}
    </div>
  );
}

function Accounts({ accounts, user, isAdmin, onEdit }) {
  // let accounts = Object.keys(accs);
  return (
    <div>
      <br />
      <br />
      {accounts &&
        Object.values(accounts)?.filter((a) => a !== null).length !== 0 && (
          <h1>Accounts</h1>
        )}
      {accounts &&
        Object.values(accounts)?.filter((a) => a !== null).length === 0 && (
          <div className="center">
            <img src={logo} className={"logo-pic"} width={200} alt="xs" />
            <h1>Link accounts</h1>
            <p>
              You can link more than 50+ different accounts, like Facebook,
              Instagram, Spotity etc.
            </p>
            <p>
              All accounts links will be access through your one special Unilink.
            </p>
          </div>
        )}
      {accounts &&
        Object.keys(accounts).map((acc, k) => {
          if (accounts[acc] === null) return null;
          const content = (
            <div key={k}>
              <div
                className="card flex account-card"
                style={{ padding: "2rem 2rem", marginBottom: "2rem" }}
              >
                <span
                  className={"fab " + accounts[acc]?.icon}
                  style={{ fontSize: "6rem", color: "white" }}
                />
                <div style={{ width: "65%", paddingLeft: "1rem" }}>
                  <h3 style={{ color: "white" }}>{accounts[acc]?.name}</h3>
                  <p>{accounts[acc]?.desc}</p>
                </div>
                {!isAdmin && (
                  <span>
                    <span className="fas fa-chevron-right" />
                  </span>
                )}
                {isAdmin && (
                  <span>
                    <span
                      onClick={() => onEdit("account", accounts[acc])}
                      className="fas fa-pen-to-square"
                    ></span>
                  </span>
                )}
              </div>
            </div>
          );
          return isAdmin ? (
            <div>{content}</div>
          ) : (
            <a
              className="account_link"
              href={accounts[acc]?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        })}
    </div>
  );
}

export default function Dashboard({ isAdmin, user, unilink, onNav }) {
  const [editPage, setEditPage] = useState(null);
  const [editData, setEditData] = useState();
  const [userData, setUserData] = useState();
  const [error, setError] = useState();
  const [busy, setBusy] = useState();
  useEffect(() => {
    if (!user && unilink) fetchUserData(unilink);
    if (user) fetchUserDataByUID(user?.uid);
  }, [unilink, user]);

  const fetchUserData = (unilink) => {
    setBusy('fetching');
    DB.collection("user_data")
      .where("unilink", "==", unilink)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
            setError("invalid_unilink");
        } else {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            setUserData(doc.data());
          });
        }
        setBusy();
      })
      .catch((error) => {
        setError("invalid_unilink");
        setBusy()
        // console.log("Error getting documents: ", error);
      });
  };
  const fetchUserDataByUID = (uid) => {
    setBusy('fetching')
    DB.collection("user_data")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          
        }
        setBusy(false);
      });
  };

  const createUserData = (uid) => {
    // console.log("createUserData", uid);
    setBusy('creating');
    let profile = {
      name: user?.displayName,
      dp: user?.photoURL,
      bio: "I'am using unilink",
      unilink: user.email,
    };

    DB.collection("user_data")
      .doc(uid)
      .set({ ...profile })
      .then(() => {
        setBusy(false);
        fetchUserDataByUID(uid);
      });
    DB.collection("taken_links")
      .doc("links_array")
      .get()
      .then((doc) => {
        // console.log("Dco");
        if (doc.exists) {
          let taken = doc.data();
          let newLinks = [...taken?.links];
          newLinks.push(user.email);
          DB.collection("taken_links")
            .doc("links_array")
            .set({ links: newLinks });
        } else {
          DB.collection("taken_links")
            .doc("links_array")
            .set({ links: [user.email] });
        }
      });
  };
  const handleEdit = (type, data) => {
    setEditPage(type);
    setEditData(data);
  };
  // console.log("userData", userData);
  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      {error === "invalid_unilink" && (
        <div className="center">
          <img
            src={logo}
            className={busy ? "logo-pic slow-spin" : "logo-pic"}
            alt="xs"
          />
          <div>
            <h1>Oops...</h1>
            <p>Looks like this Unilink doesn't exists </p>
          </div>

          <Button busy={busy} onClick={() => onNav("home")}>
            Get Started with{" "}
            <span style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
              Unilink
            </span>
          </Button>
        </div>
      )}
      {isAdmin && !userData && (
        <div className="center">
          <img
            src={logo}
            className={busy ? "logo-pic slow-spin" : "logo-pic"}
            alt="xs"
          />
          {!busy && (
            <div>
              <h1>Create your UniLink</h1>
              <p>50+ accounts, one simple link.</p>
            </div>
          )}
          {busy === "creating" && (
            <div>
              <h1>Creating...</h1>
              <p>Sugar, Spice and everything wise.</p>
            </div>
          )}
          {busy === "fetching" && (
            <div>
              <h1>Fetching...</h1>
              <p>Sugar, Spice and everything wise.</p>
            </div>
          )}

          <Button busy={busy} onClick={() => createUserData(user?.uid)}>
            Create{" "}
            <span style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
              Unilink
            </span>
          </Button>
        </div>
      )}
      {userData && (
        <Profile
          user={user}
          isAdmin={isAdmin}
          profile={userData}
          onEdit={(type, data) => handleEdit(type, data)}
        />
      )}
      {userData && (
        <Accounts
          accounts={userData?.accounts}
          user={user}
          isAdmin={isAdmin}
          onEdit={(type, data) => handleEdit(type, data)}
        />
      )}
      {isAdmin && userData && (
        <Button onClick={() => handleEdit("account", {})}>Add Account</Button>
      )}
      <Dialog open={editPage} deep>
        {editPage === "account" && (
          <EditAccount
            user={user}
            onBack={() => {
              setEditPage();
              setEditData();
            }}
            onSave={() => {
              setEditPage();
              setEditData();
              fetchUserDataByUID(user?.uid);
            }}
            account={editData}
          />
        )}
        {editPage === "profile" && (
          <EditProfile
            user={user}
            onBack={() => {
              setEditPage();
              setEditData();
            }}
            onSave={() => {
              setEditPage();
              setEditData();
              fetchUserDataByUID(user?.uid);
            }}
            profile={editData}
          />
        )}
      </Dialog>
    </div>
  );
}
