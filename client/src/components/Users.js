import * as React from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function Users() {
  const { users } = useSelector((state) => state.CHAT);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        color: '#ffffff'
      },
      children: `${toTitleCase(name[0])}`,
    };
  }

  return (
    // <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
    //   <ListItem alignItems="flex-start">
    //     <ListItemAvatar>
    //       <Avatar alt="Remy Sharp" src="https://i.pravatar.cc/300?u=1" />
    //     </ListItemAvatar>
    //     <ListItemText
    //       primary="Emerson Mclean"
    //       secondary={<React.Fragment>{"Admin"}</React.Fragment>}
    //     />
    //   </ListItem>
    // </List>

    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <ListItem key="count" alignItems="flex-start">
          <Typography variant="h6" component="div" >
            {users.length + ` Participant${users.length > 1 ? "s" : ""}`}{" "}
          </Typography>
        </ListItem>
        {users.map((e, i) => (
          <ListItem key={i} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={e.user} {...stringAvatar(e.user)} />
            </ListItemAvatar>

            <ListItemText
              sx={{ pt: 1.2 }}
              primary={toTitleCase(e.user)}
              secondary={null}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
