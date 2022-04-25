import React from "react";
import "./Button.css";
import ReactDOM from "react-dom";

export default function Button({
  children,
  accent,
  busy,
  link,
  disabled,
  stickToBottom,
  ...props
}) {
  const extraStyle = stickToBottom
    ? {
        position: "fixed",
        bottom: "3rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80vw",
        zIndex: 2000
      }
    : {};

  const s = (
    <button
      style={{ opacity: disabled ? 0.6 : 1, ...extraStyle }}
      className={
        (link
          ? "btn-default btn-link"
          : accent
          ? "btn-default btn-accent"
          : "btn-default") +
        " " +
        (busy ? "btn-busy" : "")
      }
      {...props}
      onClick={disabled ? null : props.onClick}
    >
      <div className="glass-pane"></div>

      {busy ? <span className="fas fa-circle-notch fa-spin" /> : children}
    </button>
  );
  return stickToBottom ? ReactDOM.createPortal(s, document.body) : s;
}
