import "./index.css";
import { useState, useEffect } from "react";
import { SignIn } from "./Component/UserAuth/SignIn";
import Dashboard from "./Component/Dashboard/Dashboard";
import Header from "./Component/Header/Header";
import { auth } from "./firebaseConfig";

export const Smoother = ({ active, children, deep }) => (
  <div className={active ? "smoother smooth-show" : "smoother"}>
    {deep ? (active ? children : null) : children}
  </div>
);

function App() {
  const [path, setPathFinal] = useState("home");
  const [user, setUser] = useState();
  const [unilink, setUnilink] = useState();
  const setPath = (p) => {
    // console.log("Redirect", p);
    setPathFinal(p);
  };

  useEffect(() => {
    if (user) {
      setPath("dashboard");
    } else {
      // setPath("home");
    }
    auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
    });
    processUniLink();
  }, [user]);

  const processUniLink = () => {
    let pathname = window.location.pathname;
    // console.log("PathName", pathname);
    if (pathname.includes("/") && pathname.split("/").length === 2) {
      let p = pathname.split("/").reverse()[0];
      if (p !== "") {
        setUnilink(p);
        setPath("unilink");
      }
    } else {
      setPath("home");
    }
  };
  return (
    <div className="App">
      <Header
        onNav={setPath}
        user={user}
        signOut={() => {
          setPath("home");
          auth.signOut();
        }}
      />
      <Smoother active={path === "home"}>
        <SignIn
          active={path === "home"}
          onNav={setPath}
          user={user}
          onAuth={(user) => {
            // console.log(user);
            setUser(user);
          }}
        />
      </Smoother>
      <Smoother active={path === "dashboard"}>
        <Dashboard user={user} onNav={setPath} isAdmin={user} />
      </Smoother>
      <Smoother active={path === "unilink"}>
        <Dashboard unilink={unilink} onNav={setPath} />
      </Smoother>
      {/* {user && path === "dashboard" && (
        <BottomNav user={user} onNav={setPath} />
      )} */}
    </div>
  );
}

export default App;
