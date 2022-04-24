import React from 'react'

export default function Dialog({open, children}) {
  return open ? (
    <div className={open ? "dialog dialog-show" : "dialog"}>
      <div style={{maxWidth: 400, margin: '0 auto'}}>{children}</div>
    </div>
  ) : (
    <div />
  );
}
