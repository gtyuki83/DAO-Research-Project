import React, { useState, useEffect } from "react";

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
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import Grid from "@mui/material/Grid";

import { AccountCircle, AccessAlarm, ThreeDRotation, AccountBalanceWallet } from '@mui/icons-material';

import TaskTable from "./TaskTable.tsx";
import CheckWallet from "../../data/blockchain_actions/checkWallet";

// Firebase関係
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

const style = {
  // position: 'absolute' as 'absolute',
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  // width: 600,
  color: 'white',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  background: 'linear-gradient(45deg, #ff7f50,#ff1493)',
  boxShadow: 24,
  p: 2,
};

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
interface Data {
  Name: string;
  Address: string;
}

function createData(
  name: string,
  address: string,
) {
  return { name, address };
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

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const [currentAccount, setCurrentAccount] = useState(null);
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    CheckWallet().then(function (result) {
      const address = result;
      setCurrentAccount(address);
    });
  };

  const [rows, setRows] = React.useState([]);

  async function readAccount() {
    var arr: any = [];
    // アドレスがDBにあるか探索
    const q = query(collection(firebaseFirestore, "users"), where("address", "==", currentAccount.toLowerCase()))
    const querySnapshot: any = await getDocs(q)
    await arr.push(createData("未設定", currentAccount.toLowerCase()))
    await setRows(arr);
    await getDocs(q).then(snapshot => {
      snapshot.forEach(doc => {
        arr = [];
        arr.push(createData(doc.data().name, doc.data().address))
        setRows(arr);
      })
    })
  };

  useEffect(() => {
    readAccount();
  }, [currentAccount]);

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
        <Box sx={style}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            align='center'
            variant="h6"
            component="div"
          >
            Earned：160 PSL
            <br />
            Great!
          </Typography>
        </Box>
        <TaskTable />
      </div>
      <div>
        <Box sx={style}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            align='center'
            variant="h6"
            component="div"
          >
            Earned：240 SMT
            <br />
            Good!
          </Typography>
        </Box>
        <TaskTable />
      </div>
      <div>
        <Box sx={style}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            align='center'
            variant="h6"
            component="div"
          >
            Earned：200 ADM
            <br />
            Nice!
          </Typography>
        </Box>
        <TaskTable />
      </div>
    </CenteredTabs>
  </div >;
};

export default MyPage;
