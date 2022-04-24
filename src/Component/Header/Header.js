import React from 'react'
import { Link, withRouter } from "react-router-dom";
import './Header.css'

function Header({ user, signOut, onNav }) {
  return (
    <div className="header">
      <span className="logo" onClick={() => onNav(user ? 'dashboard' : "home")}>
        UniLink
      </span>
      <div>
        {/* {user && <button className="header-btn">Back</button>} */}
        {user && (
          <button className="header-btn" onClick={signOut}>
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
