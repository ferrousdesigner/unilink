import "./index.css";
import { useState, useEffect } from "react";
import { SignIn } from "./Component/UserAuth/SignIn";
import Dashboard from "./Component/Dashboard/Dashboard";
import Header from "./Component/Header/Header";
import { auth } from "./firebaseConfig";
import logo from "./../src/images/unilink.png";

export const Smoother = ({ active, children, deep }) => (
  <div className={active ? "smoother smooth-show" : "smoother"}>
    {deep ? (active ? children : null) : children}
  </div>
);

export const Loader = ({ title }) => {
  return (
    <div className="center">
      <section>
        <img src={logo} className="logo-pic slow-spin" alt="xs" />
        <h1 className="logo-big">{title || "Getting ready"}</h1>
        <h3>Please wait while we get things ready.</h3>
        <br />
      </section>
    </div>
  );
};

function App() {
  const [path, setPathFinal] = useState("busy");
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState(null);
  const [unilink, setUnilink] = useState(null);

  const setPath = (p) => {
    setPathFinal(p);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setPath("dashboard");
      } else {
        setUser(null);
        setPath("home");
      }
    });

    processUniLink();
    return () => unsubscribe();
  }, []);

  const processUniLink = () => {
    const pathname = window.location.pathname;
    if (pathname.includes("/") && pathname.split("/").length === 2) {
      setBusy(true);
      const p = pathname.split("/").reverse()[0];
      if (p) {
        setUnilink(p);
        setPath("unilink");
      } else {
        setPath(user ? "dashboard" : "home");
      }
      setBusy(false);
    } else {
      setPath("home");
    }
  };

  return (
    <div className="App">
      <Header
        onNav={setPath}
        user={user}
        path={path}
        signOut={() => {
          setPath("home");
          auth.signOut();
        }}
      />
      <Smoother active={path === "busy"} deep>
        <Loader />
      </Smoother>
      <Smoother active={path === "home"} deep>
        <SignIn
          active={path === "home"}
          onNav={setPath}
          user={user}
          onBusy={setBusy}
          onAuth={(user) => setUser(user)}
        />
      </Smoother>
      <Smoother active={path === "dashboard"} deep>
        <Dashboard user={user} onNav={setPath} />
      </Smoother>
      <Smoother active={path === "unilink"} deep>
        <Dashboard unilink={unilink} onNav={setPath} appBusy={busy} />
      </Smoother>
    </div>
  );
}

export default App;
