import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="App-header">
      <h1> Welcome to the CataGram!</h1>
      <h3> To Begin. Sign In to Message boards to be able to post!</h3>
      <h4> Even if you do not sign in, you can still see the board!</h4>
      <h4> Below are links to move through the pages!</h4>
      <button>
        <Link to={"/auth"}>Login/Logout</Link>
      </button>
      <button>
        <Link to={"/messages"}>Message Board</Link>
      </button>
    </div>
  );
}
