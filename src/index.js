import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Components/Welcome";
import Messages from "./Components/Messages";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<App />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="*" element={<Welcome />} />
    </Routes>
  </BrowserRouter>
);
