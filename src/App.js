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

export const Loader = () => {
  return (
    <div className="center">
      <section>
        <img src={logo} className="logo-pic slow-spin" alt="xs" />
        <h1 className="logo-big">Getting ready</h1>
        <h3>Please wait while we get things ready.</h3>
        <br />
      </section>
    </div>
  );
}

export const Logo = () => <img src={logo} className="logo-pic" width="100px" />;

function App() {
  const [path, setPathFinal] = useState("busy");
  const [user, setUser] = useState();
  const [unilink, setUnilink] = useState();
  const setPath = (p) => {
    // console.log("Redirect", p);
    setPathFinal(p);
  };

  useEffect(() => {
    if (user) {
      // setBusy()
      // setPath("dashboard");
    } else {
      // setBusy();
      // setPath("home");
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // setTimeout(() => setPath("home"), 1000);
      }
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
      } else {
        user ? setPath('dashboard' ) :setPath("home");
      }
    } else {
      setPath("home");
    }
  };
  return (
    <div className="App">
      <div>
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
            onAuth={(user) => {
              // console.log(user);
              setUser(user);
            }}
          />
        </Smoother>
        <Smoother active={path === "dashboard"} deep>
          <Dashboard user={user} onNav={setPath} isAdmin={user} />
        </Smoother>
        <Smoother active={path === "unilink"} deep>
          <Dashboard unilink={unilink} onNav={setPath} />
        </Smoother>
      </div>

      {/* {user && path === "dashboard" && (
        <BottomNav user={user} onNav={setPath} />
      )} */}
    </div>
  );
}

export default App;
