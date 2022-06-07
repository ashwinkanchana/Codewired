import React, { useEffect, useState } from "react";

import "./style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Join from "../Join";
import { getsocketIoInstance } from "../../utils/socketio-client";

import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  useEffect(() => {});
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={<Navigate to={`/${uuidv4()}`} replace />}
      />
      <Route path="/:roomId" element={<Join />} />
    </Routes>
  );
}
