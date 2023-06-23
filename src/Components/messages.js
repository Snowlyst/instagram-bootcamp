import React from "react";
import { onChildAdded, push, ref as messageRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "../App.css";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      fileAdded: null,
      fileValue: "",
      input: "",
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
      name: this.props.name,
    });
    this.setState({
      input: "",
      fileAdded: null,
      fileValue: "",
    });
  };
  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => {
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
        {this.props.isLoggedOn ? (
          <div>
            <button onClick={this.props.doSignOut}>Sign Out!</button>
            <br />
            <input
              type="text"
              name="text"
              value={this.state.input}
              placeholder="type message here"
              onChange={(e) => this.setState({ input: e.target.value })}
            />
            <br />
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
            <br />
            <button onClick={this.submitData}>Send</button>
          </div>
        ) : null}
        {messageListItems}
      </div>
    );
  }
}
