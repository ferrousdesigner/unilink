import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Header.css";

function Header({ user, signOut, onNav, path }) {
  const realNav = (path) => {
    window.location.href = path;
  };
  return (
    <div className="header">
      <span className="logo" onClick={() => onNav(user ? "dashboard" : "home")}>
        lynkone
      </span>
      <div>
        {/* {user && <button className="header-btn">Back</button>} */}
        {user && path !== "unilink" && (
          <button className="header-btn" onClick={signOut}>
            Sign Out
          </button>
        )}
        {user && path === "unilink" && (
          <button className="header-btn" onClick={() => onNav("dashboard")}>
            Dashboard
          </button>
        )}
        {!user && path === "unilink" && (
          <button
            className="header-btn"
            onClick={() => realNav("https://lynkone.me")}
          >
            Learn More
          </button>
        )}
        {!user && path !== "unilink" && path !== "home" && (
          <button className="header-btn" onClick={() => onNav("home")}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
