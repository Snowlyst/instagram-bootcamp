import React, { useEffect, useState } from "react";
import { onChildAdded, push, ref as messageRef, set } from "firebase/database";
import { database, storage, auth } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "../App.css";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

export default function Messages(props) {
  const [user, setUser] = useState("");
  const [isLoggedOn, setIsLoggedOn] = useState(null);
  const [messages, setMessages] = useState([]);
  const [fileAdded, setFileAdded] = useState(null);
  const [fileValue, setFileValue] = useState("");
  const [input, setInput] = useState("");

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

  useEffect(() => {
    const messagesRef = messageRef(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  const submitData = () => {
    const fullStorageRef = storageRef(storage, STORAGE_KEY + fileAdded.name);
    uploadBytes(fullStorageRef, fileAdded.name).then(() => {
      console.log(`fileadded: ${fileAdded}`);
      getDownloadURL(fullStorageRef, fileAdded.name).then((url) => {
        console.log(`fileadded.name: ${fileAdded.name}`);
        writeData(url);
      });
    });
  };
  const writeData = (url) => {
    const messageListRef = messageRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: input,
      time: new Date().toLocaleString(),
      url: url,
      name: user,
    });
    setInput("");
    setFileAdded(null);
    setFileValue("");
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => {
    console.log(message);
    return (
      <div className="App">
        <div className="App-header">
          <div>
            {message.val.time}
            <br />
            {message.val.name} says..
            <br /> {message.val.message}
          </div>
          <img
            src={message.val.url}
            alt={message.val.name}
            style={{ height: "30vh" }}
          />
        </div>
      </div>
    );
  });

  messageListItems.reverse();
  return (
    <div className="App-header">
      {isLoggedOn ? (
        <div>
          <div>Signed in as {user}</div>
          <div>Upload Area!</div>
          <input
            type="text"
            name="text"
            value={input}
            placeholder="type message here"
            onChange={(e) => setInput(e.target.value)}
          />
          <br />
          <input
            type="file"
            name="file"
            value={fileValue}
            onChange={
              ((e) => setFileAdded(e.target.files[0]),
              (e) => setFileValue(e.target.value))
            }
          />
          <br />
          <button onClick={submitData}>Send</button>
        </div>
      ) : null}
      <button>
        <Link to={"/"}>Back to Homepage!</Link>
      </button>
      <button>
        <Link to={"/auth"}>Login/Logout</Link>
      </button>

      {messageListItems}
    </div>
  );
}
