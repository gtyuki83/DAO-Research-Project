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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import Grid from "@mui/material/Grid";

import { AccountCircle, AccessAlarm, ThreeDRotation, AccountBalanceWallet } from '@mui/icons-material';

import TaskTable from "./TaskTable.tsx";
import CheckWallet from "../../data/blockchain_actions/checkWallet";
import MyProposalTable from "./MyProposalTable.tsx";
import MyTaskTable from "./MyTaskTable.tsx";
import MyCommentTable from "./MyCommentTable.tsx";
import { countActivity } from "./FirebaseAction.tsx";

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
  justifyContent: 'center',
  // width: '80%',
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
  // 各アクティビティの実績数を取得する状態変数
  const [activity, setActivity] = React.useState({
    "proposals": 0,
    "tasks": 0,
    "comments": 0,
  });
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
      countActivity(address).then(function (result) {
        setActivity({
          "proposals": result[0],
          "tasks": result[1],
          "comments": result[2],
        })
      })
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
        <Table sx={{ minWidth: 650, display: { xs: "none", sm: "flex" } }} aria-label="simple table">
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
      < Box sx={{ display: { xs: "flex", sm: "none" } }}>
        <Grid container>
          <Grid item xs={12}>
            <Box>
              {rows.map((row, i) => {
                return (
                  <Grid item xs={12}>
                    <Box >
                      <Card>
                        <CardContent>
                          <Typography sx={{ mt: 1.5 }} variant="h6" component="div">
                            {row.name}
                          </Typography>
                          <Typography sx={{ mt: 1.5 }} color="text.secondary">
                            address：{row.address}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                )
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box >
    <Divider></Divider>
    <Stack direction="row" spacing={1}>
      <Chip label="#DAO研究会" color="primary" onClick={handleClick} />
      {/* <Chip label="#PolygonTokyoHack" color="primary" variant="outlined" onClick={handleClick} />
      <Chip label="#ETHOnline" color="primary" variant="outlined" onClick={handleClick} /> */}
    </Stack>
    <CenteredTabs labels={[`Proposal(${activity.proposals})`, `Tasks(${activity.tasks})`, `comments(${activity.comments})`]}>
      <div>
        <MyProposalTable />
      </div>
      <div>
        <MyTaskTable />
      </div>
      <div>
        <MyCommentTable />
      </div>
    </CenteredTabs >
  </div >;
};

export default MyPage;
