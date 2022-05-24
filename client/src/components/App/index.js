import React, { useState } from "react";
import RoomLayout from "../RoomLayout";
import "./style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Join from "../Join";
import { getsocketIoInstance } from "../../utils/socketio-client";
import {
  styled,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
let memberElems;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const [verified, setVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <RoomLayout />
    </ThemeProvider>
  );
}
