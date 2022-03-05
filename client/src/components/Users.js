import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Users() {
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="https://i.pravatar.cc/300?u=1" />
                </ListItemAvatar>
                <ListItemText
                    primary="Emerson Mclean"
                    secondary={
                        <React.Fragment>
                            {'Admin'}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Travis Howard" src="https://i.pravatar.cc/300?u=2" />
                </ListItemAvatar>
                <ListItemText
                    primary="Samad Franklin"
                    secondary={
                        <React.Fragment>
                            {'Member'}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Travis Howard" src="https://i.pravatar.cc/300?u=4" />
                </ListItemAvatar>
                <ListItemText
                    primary="Dylan Colley"
                    secondary={
                        <React.Fragment>
                            {'Member'}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Cindy Baker" src="https://i.pravatar.cc/300?u=3" />
                </ListItemAvatar>
                <ListItemText
                    primary="Kimberly Erickson"
                    secondary={
                        <React.Fragment>
                            {'Guest'}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </List>
    );
}