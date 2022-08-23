import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';

import Grid from "@material-ui/core/Grid";

import { AccountCircle, AccessAlarm, ThreeDRotation, AccountBalanceWallet } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  grid: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  },
});

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

  const classes = useStyles();

  const CenteredTabs = (props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <div>
        <Paper className={classes.root}>
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



  return <div className={classes.root}>
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
