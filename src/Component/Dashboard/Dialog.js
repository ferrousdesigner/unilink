import React from 'react'
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Dialog({open, children}) {
  useEffect(() => {
    document.body.style.overflowY = open ? 'hidden' : 'auto'
  }, [open])
  return open ? (
    ReactDOM.createPortal(
      <div className={open ? "dialog dialog-show" : "dialog"}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>{children}</div>
      </div>,
      document.body
    )
  ) : (
    <div />
  );
}
