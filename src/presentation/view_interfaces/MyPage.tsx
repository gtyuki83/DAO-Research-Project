import React from "react";

import { makeStyles } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';

import Grid from "@mui/material/Grid";

import { AccountCircle, AccessAlarm, ThreeDRotation, AccountBalanceWallet } from '@mui/icons-material';


const TabPanel = (props) => {
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
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}


const MyPage = (props) => {
  const hoge: string = "";

  const CenteredTabs = (props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <div>
        <Paper className="">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {props.labels.map(label => <Tab label={label}></Tab>)}
          </Tabs>
        </Paper>

        {/* 追加 */}
        {props.children.map((child, index) =>
          <TabPanel value={value} index={index}>{child}</TabPanel>)
        }
      </div>
    );
  }



  return <div className="">
    <Grid container>
      <Grid item>
        <List component="nav" aria-label="mailbox folders">
          <ListItemAvatar>
            <Avatar alt="kakakakakku" src="https://assets.stickpng.com/images/580b57fbd9996e24bc43c051.png" />
          </ListItemAvatar>
          <ListItem button>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Name" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="0xUYZ" />
          </ListItem>
          <Divider />
        </List>
      </Grid>
      <Grid item>
        <List component="nav" aria-label="mailbox folders">
          <ListItem button>
            <ListItemIcon>
              <AccountBalanceWallet />
            </ListItemIcon>
            <ListItemText primary="Address" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e" />
          </ListItem>
          <Divider />
        </List>
      </Grid>
    </Grid>
    <CenteredTabs labels={['label1', 'label2', 'label3']}>
      <div>aaaaaaa
        <br />
        a
      </div>
      <div>bb</div>
      <div>cc</div>
    </CenteredTabs>
  </div >;
};

export default MyPage;
