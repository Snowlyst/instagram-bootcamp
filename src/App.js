import React from "react";
import { onChildAdded, push, ref as messageRef, set } from "firebase/database";
import { auth, database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input: "",
      fileAdded: null,
      fileValue: "",
      user: "",
      password: "",
      isLoggedOn: false,
      likeCount: 0,
    };
  }

  componentDidMount() {
    const messagesRef = messageRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }
  submitData = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileAdded.name
    );
    uploadBytes(fullStorageRef, this.state.fileAdded).then(() => {
      console.log(`fileadded: ${this.state.fileAdded}`);
      getDownloadURL(fullStorageRef, this.state.fileAdded.name).then((url) => {
        console.log(`fileadded.name: ${this.state.fileAdded.name}`);
        this.writeData(url);
      });
    });
  };
  writeData = (url) => {
    const messageListRef = messageRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.input,
      time: new Date().toLocaleString(),
      url: url,
    });
    this.setState({
      input: "",
      fileAdded: null,
      fileValue: "",
    });
  };

  signIn = () => {
    signInWithEmailAndPassword(auth, this.state.user, this.state.password)
      .then((userSignedIn) => {
        console.log(userSignedIn);
        this.setState({
          isLoggedOn: true,
        });
      })
      .catch((error) => {
        console.log("error" + error);
        alert("ERROR " + error);
      });
  };

  signUp = () => {
    createUserWithEmailAndPassword(auth, this.state.user, this.state.password)
      .then((userSignedIn) => {
        console.log("signed in" + userSignedIn);
        alert("Sign in Success! Welcome back. " + this.state.user);
        this.setState({
          isLoggedOn: true,
        });
      })
      .catch((error) => {
        console.log("error" + error);
        alert("ERROR" + error);
      });
  };
  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => {
      return (
        <div>
          <div>
            {message.val.time} - {message.val.message}
          </div>
          <img
            src={message.val.url}
            alt={message.val.name}
            style={{ height: "30vh" }}
          />
          <div>
            <button onClick={this.handleLike} disabled={!this.state.isLoggedOn}>
              ❤️
            </button>
            <div>Likes: {this.state.likeCount}</div>
          </div>
        </div>
      );
    });

    messageListItems.reverse();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {this.state.isLoggedOn ? (
            <div>
              <input
                type="text"
                name="text"
                value={this.state.input}
                placeholder="type message here"
                onChange={(e) => this.setState({ input: e.target.value })}
              />
              <input
                type="file"
                name="file"
                value={this.state.fileValue}
                onChange={(e) => {
                  this.setState({
                    fileAdded: e.target.files[0],
                    fileValue: e.target.value,
                  });
                }}
              />
              <button onClick={this.submitData}>Send</button>
            </div>
          ) : (
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
          )}
          {messageListItems}
        </header>
      </div>
    );
  }
}

export default App;
