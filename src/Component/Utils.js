var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

const fallbackCopyTextToClipboard = (text) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};
export const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

const sanitizeString = (str) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
};
export const clean = (type, val) => {
  switch (type) {
    case "icon":
      return val;
    case "account.name":
      return sanitizeString(val);
    case "account.desc":
      return sanitizeString(val);
    case "account.link":
      return sanitizeUrl(val);
    case "profile.name":
      return sanitizeString(val);
    case "profile.bio":
      return sanitizeString(val);
    case "profile.unilink":
      return sanitizeUrl(val);
    default:
      break;
  }
};
