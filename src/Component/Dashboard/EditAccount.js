import React from "react";
import Button from "../Button/Button";
import { useState } from "react";
import { useEffect } from "react";
import { DB } from "../../firebaseConfig";
import Dialog from "./Dialog";
import { FabIcons } from "./Icons";
import { clean } from "../Utils";

export const BackArrow = ({ onClick }) => (
  <button onClick={onClick} className="back-btn">
    <span className="fas fa-chevron-left"></span>
  </button>
);
export default function EditAccount({ account, isAdmin, user, onBack, onSave }) {
  const [name, setName] = useState();
  const [busy, setBusy] = useState();
  const [desc, setDesc] = useState();
  const [icon, setIcon] = useState();
  const [link, setLink] = useState();
  const [dialog, setDialog] = useState();

  useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

    setName(account?.name);
    setDesc(account?.desc);
    setIcon(account?.icon);
    setLink(account?.link);
    if (!account?.icon) setDialog("icons");
    
  }, [account]);

  const saveAccount = () => {
    setBusy(true);
    if (!icon) return;
    let account = {
      icon: clean("icon", icon),
      desc: clean("account.desc", desc),
      name: clean("account.name", name),
      link: clean("account.link", link),
      added: new Date().getTime(),
    };
    var usersUpdate = {};
    usersUpdate[`accounts.${icon}`] = account;

    DB.collection("user_data")
      .doc(user?.uid)
      .update(usersUpdate)
      .then(() => {
        setBusy(false);
        onSave();
      });
  };
  const deleteAccount = () => {
    var usersUpdate = {};
    usersUpdate[`accounts.${icon}`] = null;
    DB.collection("user_data")
      .doc(user?.uid)
      .update(usersUpdate)
      .then(() => {
        setBusy(false);
        onSave();
      });
  };
  const onSelectAccount = (icon) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIcon(icon.icon);
    setName(icon.name);
    setDesc("My projects on " + (icon.name || "youtube page"));
    setDialog();
  };
  return (
    <div>
      <h1>
        <BackArrow onClick={() => onBack()} />
        Edit Account
      </h1>
      <div style={{ paddingTop: "3rem" }}>
        <div>
          <div
            className="card flex account-card"
            style={{ padding: "2rem 2rem", marginBottom: "2rem" }}
          >
            <span
              className={"fab " + icon}
              style={{ fontSize: "6rem", color: "white" }}
            />

            <div style={{ width: "65%", paddingLeft: "1rem" }}>
              <h3 style={{ color: "white" }}>{name}</h3>
              <p>{desc}</p>
            </div>
            {!isAdmin && (
              <span>
                <span className="fas fa-chevron-right" />
              </span>
            )}
          </div>
        </div>
      </div>
      <fieldset>
        <label>Icon</label>
        <br />
        <div className="flex">
          <span
            className={"fab " + (icon || " fa-instagram")}
            style={{ fontSize: "9rem", color: "white" }}
          />
          {!account?.added && (
            <button onClick={() => setDialog("icons")} className="header-btn">
              {icon ? "Change Account" : "Select Account"}
            </button>
          )}
        </div>
      </fieldset>
      <br />
      <fieldset>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </fieldset>

      <fieldset>
        <label>Description</label>
        <input
          value={desc}
          placeholder={"My projects on " + (name || "youtube page")}
          onChange={(e) => setDesc(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>Link</label>
        <input
          type="url"
          value={link}
          pattern="https?://.+"
          required
          onChange={(e) => setLink(e.target.value)}
        />
      </fieldset>
      <br />
      <br />
      <br />
      <Button
        busy={busy}
        stickToBottom
        onClick={() => saveAccount()}
        disabled={!(link && name && desc && icon)}
      >
        Save
      </Button>
      {account?.name && (
        <Button busy={busy} accent onClick={() => deleteAccount()}>
          Delete Account
        </Button>
      )}
      <Dialog open={dialog === "icons"}>
        <h1>
          <BackArrow
            onClick={() => (account?.added ? onBack() : setDialog())}
          />
          Select Account
        </h1>
        {FabIcons.map((icon, key) => (
          <button
            key={key}
            className="account-select-btn"
            onClick={() => onSelectAccount(icon)}
          >
            <span className={"fab " + icon.icon} /> <span>{icon.name}</span>
            {icon === icon.icon ? (
              <span className="fas fa-check-circle" />
            ) : (
              <span className="fas fa-chevron-right" />
            )}
          </button>
        ))}
        <br />
        <br />
        <br />
        <br />
      </Dialog>
    </div>
  );
}
