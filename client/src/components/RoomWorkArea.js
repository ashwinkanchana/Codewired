import React from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Code from './Code'
import Whiteboard from './Whiteboard'
import Whiteboardsocket from './Whiteboardsocket'
import Grid from '@mui/material/Grid';
import CodeIcon from '@mui/icons-material/Code';
import GestureIcon from '@mui/icons-material/Gesture';

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
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Grid container >
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
                        <Tabs value={value}

                            orientation="vertical"
                            onChange={handleChange}
                            sx={{ borderRight: 1, borderColor: 'divider' }}>
                            <Tab icon={<CodeIcon fontSize="small" />} label="Code" aria-label="phone" {...a11yProps(0)} />
                            <Tab icon={<GestureIcon fontSize="small" />} label="Scribble" aria-label="favorite" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={11} md={11} lg={11} xl={11}>
                    <TabPanel value={value} index={0}>
                        <Code />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {/* <Whiteboard /> */}
                        <Whiteboardsocket/>
                    </TabPanel>
                </Grid>

            </Grid>




        </>
    );
}