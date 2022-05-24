// import React from 'react'
// import PropTypes from 'prop-types';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
import React, { useState } from "react";
import {
  Box,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { Code, Videocam, Gesture } from "@mui/icons-material";
import {
  styled,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

import CodeComponent from "./Code";
import Whiteboard from "./Whiteboard";
import Whiteboardsocket from "./Whiteboardsocket";
import Grid from "@mui/material/Grid";

// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box>
//                     {children}
//                 </Box>
//             )}
//         </div>
//     );
// }

// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

// export default function BasicTabs() {
//     const [value, setValue] = React.useState(0);

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     return (
//         <>
//             <Grid container >
//                 <Grid item xs={1}>
//                     <Box
//                         sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
//                         <Tabs value={value}

//                             orientation="vertical"
//                             onChange={handleChange}
//                             sx={{ borderRight: 1, borderColor: 'divider' }}>
//                             <Tab icon={<CodeIcon fontSize="small" />} label="Code" aria-label="phone" {...a11yProps(0)} />
//                             <Tab icon={<GestureIcon fontSize="small" />} label="Scribble" aria-label="favorite" {...a11yProps(1)} />
//                         </Tabs>
//                     </Box>
//                 </Grid>
//                 <Grid item xs={1} sm={11} md={11} lg={11} xl={11}>
//                     <TabPanel value={value} index={0}>
//                         <Code />
//                     </TabPanel>
//                     <TabPanel value={value} index={1}>
//                         {/* <Whiteboard /> */}
//                         <Whiteboardsocket/>
//                     </TabPanel>
//                 </Grid>

//             </Grid>

//         </>
//     );
// }



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...closedMixin(theme),
  "& .MuiDrawer-paper": closedMixin(theme),
}));

export default function MiniDrawer() {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);


  return (
    
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" open={false}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={false}>
          <DrawerHeader/>

          <List>
            <ListItem
              onClick={() => setTabValue(0)}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  <Code />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem
              onClick={() => setTabValue(1)}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  <Videocam />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => setTabValue(2)}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  <Gesture />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <TabPanel value={tabValue} index={0}>
            <CodeComponent />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Whiteboard />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Whiteboardsocket />
          </TabPanel>
        </Box>
      </Box>
  );
}
