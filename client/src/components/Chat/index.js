import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Stack, Toolbar, Box, TextField, Button, Grid } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import { Send } from "@mui/icons-material";
import ScrollToBottom from "react-scroll-to-bottom";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { COMPOSE_MESSAGE } from "../../store/actions/types";

function Chat({ sendMessage }) {
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.RTC);
  const { message, messages } = useSelector((state) => state.CHAT);
  return (
    <Box>
      <>
        <div className="chat-window">
          <div className="chat-body">
            <ScrollToBottom className="message-container">
              {messages &&
                messages.length > 0 &&
                messages.map((messageContent) => {
                  return (
                    <div
                      className="message"
                      id={
                        username?.toLowerCase() === messageContent.user
                          ? "other"
                          : "you"
                      }
                    >
                      <div>
                        <div className="message-content">
                          <p>{messageContent.text}</p>
                        </div>
                        <div className="message-meta">
                          <p id="author">{messageContent.user}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ScrollToBottom>
          </div>
          <Box
            className="chat-footer"
            sx={{ width: "340px", position: "fixed", bottom: 50 }}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={message}
              onKeyPress={(event) =>
                event.key === "Enter" ? sendMessage(event) : null
              }
              onChange={(event) => {
                dispatch({
                  type: COMPOSE_MESSAGE,
                  payload: event.target.value,
                });
              }}
              placeholder="Message"
            />
          </Box>
        </div>
      </>
    </Box>
  );
}

export default Chat;
