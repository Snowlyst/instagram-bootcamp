import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedOn, setIsLoggedOn] = useState(null);

  const navigate = useNavigate();
  const doSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser("");
        setPassword("");
        setIsLoggedOn(null);
        navigate("/");
      })
      .catch(() => {
        console.log("Failed to sign out");
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedOn(user);
        setUser(user.email);
      } else {
        setIsLoggedOn(null);
      }
    });
  });

  const signIn = () => {
    signInWithEmailAndPassword(auth, user, password)
      .then((userSignedIn) => {
        setIsLoggedOn(true);
        setUser(userSignedIn.user.email);
        navigate("/messages");
      })
      .catch((error) => {
        console.log("error" + error);
        alert("ERROR " + error);
      });
  };

  const signUp = () => {
    createUserWithEmailAndPassword(auth, user, password)
      .then((userSignedIn) => {
        setIsLoggedOn(true);
      })
      .catch((error) => {
        alert("ERROR" + error);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* TODO: Add input field and add text input as messages in Firebase */}
        {!isLoggedOn ? (
          <div>
            <div>
              <input
                name="email"
                type="email"
                value={user}
                placeholder="insert email here"
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                name="password"
                type="password"
                value={password}
                placeholder="input password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={signIn}>Login</button>
              <button onClick={signUp}>Sign Up</button>
            </div>
          </div>
        ) : (
          <button onClick={doSignOut}>Sign Out!</button>
        )}
      </header>
      <button>
        <Link to={"/"}>Back to Homepage</Link>
      </button>
      <button>
        <Link to={"/messages"}>Message Board</Link>
      </button>
    </div>
  );
}

export default App;
