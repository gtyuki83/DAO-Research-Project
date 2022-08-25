import React from "react";

import { makeStyles } from '@mui/material/styles';
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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import Grid from "@mui/material/Grid";

import { AccountCircle, AccessAlarm, ThreeDRotation, AccountBalanceWallet } from '@mui/icons-material';

import TaskTable from "./TaskTable.tsx";

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

function createData(
  name: string,
  address: string,
) {
  return { name, address };
}

const rows = [
  createData('UWYZ.eth', '0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e'),
  // createData('Yoshi', '0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e'),
];


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

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };



  return <div className="">
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Grid item>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Name" />
                </Grid>
              </TableCell>
              <TableCell >
                <Grid item>
                  <ListItemIcon>
                    <AccountBalanceWallet />
                  </ListItemIcon>
                  <ListItemText primary="Address" />
                </Grid>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box >
    <Divider></Divider>
    <Stack direction="row" spacing={1}>
      <Chip label="#Unyte" color="primary" onClick={handleClick} />
      <Chip label="#PolygonTokyoHack" color="primary" variant="outlined" onClick={handleClick} />
      <Chip label="#ETHOnline" color="primary" variant="outlined" onClick={handleClick} />
    </Stack>
    <CenteredTabs labels={['Proposals (3)', 'Submitted (5)', 'Admired (4)']}>
      <div>
        Earned：160 PSL
        <br />
        Great!
        <TaskTable />
      </div>
      <div>
        Earned：240 SMT
        <br />
        Good!
        <TaskTable />
      </div>
      <div>
        Earned：200 ADM
        <br />
        Nice!
        <TaskTable />
      </div>
    </CenteredTabs>
  </div >;
};

export default MyPage;
