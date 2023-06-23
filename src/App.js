import React from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./App.css";
import Messages from "./Components/messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      user: "",
      password: "",
      isLoggedOn: null,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert(`Welcome! ${user.email}`);
        this.setState({
          isLoggedOn: user,
          user: user.email,
        });
      } else {
        this.setState({
          isLoggedOn: null,
        });
      }
    });
  }

  signIn = () => {
    signInWithEmailAndPassword(auth, this.state.user, this.state.password)
      .then((userSignedIn) => {
        this.setState({
          isLoggedOn: true,
          user: userSignedIn.user.email,
        });
      })
      .catch((error) => {
        console.log("error" + error);
        alert("ERROR " + error);
      });
  };
  doSignOut = () => {
    signOut(auth)
      .then(() => {
        alert(`Goodbye ${this.state.user}! See you soon!`);
        this.setState({
          user: "",
          password: "",
          isLoggedOn: null,
        });
      })
      .catch(() => {
        console.log("Failed to sign out");
      });
  };

  signUp = () => {
    createUserWithEmailAndPassword(auth, this.state.user, this.state.password)
      .then((userSignedIn) => {
        alert("Sign in Success! Welcome back. " + this.state.user);
        this.setState({
          isLoggedOn: true,
        });
      })
      .catch((error) => {
        alert("ERROR" + error);
      });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {!this.state.isLoggedOn ? (
            <div>
              <div>
                <input
                  name="email"
                  type="email"
                  value={this.state.user}
                  placeholder="insert email here"
                  onChange={(e) =>
                    this.setState({
                      user: e.target.value,
                    })
                  }
                />
                <input
                  name="password"
                  type="password"
                  value={this.state.password}
                  placeholder="input password"
                  onChange={(e) =>
                    this.setState({
                      password: e.target.value,
                    })
                  }
                />
                <button onClick={this.signIn}>Login</button>
                <button onClick={this.signUp}>Sign Up</button>
              </div>
            </div>
          ) : null}
        </header>
        <Messages
          isLoggedOn={this.state.isLoggedOn}
          name={this.state.user}
          doSignOut={this.doSignOut}
        />
      </div>
    );
  }
}

export default App;
