import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Slide } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// リンクへのアクセス
import { Link } from "react-router-dom";

import { useEffect, useState } from 'react';
// Firebase関係
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

import { SubmitOutput } from "./FirebaseAction.tsx";

import CheckWallet from "../../data/blockchain_actions/checkWallet";

import TaskOutputTable from "./TaskOutputTable.tsx";
import { AcceptProposal, votingAction, sendReward } from "./FirebaseAction.tsx";
import { OutputAlert } from "./SnackBar.tsx";

import {
  useParams,
} from 'react-router-dom';

const style = {
  // position: 'absolute' as 'absolute',
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  justifyContent: "center",
  // width: '50%',
  color: 'white',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  background: 'linear-gradient(45deg, #ff7f50,#ff1493)',
  boxShadow: 24,
  // p: 4,
};

const TaskDetail = () => {
  const { id } = useParams();

  const [data, setData] = React.useState({
    assign: '',
    title: '',
    priority: '',
    description: '',
    createdBy: '',
    team: '',
    PXC: 0,
  });

  const [voting, setVoting] = React.useState({ 0x00: "for" });
  const [votingResult, setVotingResult] = React.useState(false);
  const [sentReward, setSentReward] = React.useState(false);
  const [snack, setSnack] = React.useState('false');

  async function readProposal() {
    var arr = {};
    const docRef: any = doc(firebaseFirestore, "proposals", id);
    const docSnap: any = await getDoc(docRef);

    if (docSnap.exists()) {
      setData({
        title: docSnap.data().title,
        assign: docSnap.data().assign,
        priority: docSnap.data().priority,
        description: docSnap.data().description,
        createdBy: docSnap.data().createdBy,
        team: docSnap.data().team,
        PXC: docSnap.data().reward,
      });
    } else {
      console.log("No such document!");
    }
    // votingの存在を判定
    const querySnapshot = await getDocs(collection(firebaseFirestore, `proposals/${id}/voting`));
    querySnapshot.docs.map((doc, i) => {
      arr[doc.id] = doc.data().vote
    });
    setVoting(arr);
    // votingがacceptedされている場合は状態をtrueにセット
    if (docSnap.data().success == true) {
      setVotingResult(true);
    }
    // 報酬が支払われていればtrue
    if (docSnap.data().rewarded == true) {
      setSentReward(true);
    }
  };

  useEffect(() => {
    readProposal();
  }, [voting]);

  const [description, setDescription] = React.useState('');

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const [output, setOutput] = React.useState('');

  const handleOutput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutput(event.target.value);
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

  return <div>
    <OutputAlert snack={snack} setSnack={setSnack}></OutputAlert>
    <Button variant="contained" endIcon={<ArrowBackIosNewIcon />} component={Link} to={`/tasks`} >
      Back
    </Button>
    <Stack spacing={2}>

      <Card >

        <CardContent>
          {votingResult && !sentReward && (
            <Button onClick={() => sendReward(id)} sx={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)', color: 'white', m: 1, mb: 3 }}>
              <Typography>
                報酬を送付
              </Typography>
            </Button>
          )
          }
          {votingResult && sentReward && (
            <Button disabled variant="outlined" sx={{ color: 'white', m: 1, mb: 3 }}>
              <Typography>
                報酬送付済
              </Typography>
            </Button>
          )
          }
          <br></br>
          {votingResult && (
            <Button sx={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)', color: 'white', m: 1, mb: 3 }}>
              <Typography>
                承認済
              </Typography>
            </Button>
          )
          }

          <Typography id="modal-modal-title" variant="h6" component="h2">
            {data.title}
          </Typography>

          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            assigned:{data.assign}
          </Typography> */}

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {data.description}
          </Typography>

          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            priority:{data.priority}
          </Typography> */}

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            reward:{data.PXC}PXC
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            createdBy:{data.createdBy.substr(0, 5)}...{data.createdBy.substr(-5)}
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 10 }}>
          </Typography> */}

        </CardContent>
      </Card >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          🚀Submit Your Output🚀
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <TextField id="fullWidth" label="Output Link" variant="outlined" value={output} onChange={handleOutput} />
          </FormControl>
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <TextField multiline maxRows={5} id="fullWidth" label="Description" variant="outlined" value={description} onChange={handleDescription} />
          </FormControl>
        </Typography>
        <Button onClick={() => SubmitOutput(description, output, currentAccount, id, data.team)} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />} margin="normal">
          Submit
        </Button>
      </Box>
    </Stack>
    <TaskOutputTable taskid={id}></TaskOutputTable>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      <Button variant="contained" endIcon={<AddCircleIcon />} sx={{ width: 120, m: 2 }} onClick={async () => {
        const trying = await votingAction(id, currentAccount, "for");
        if (trying == "success") {
          setSnack("vote")
        }
        await readProposal();
      }} >
        Yes
      </Button>

      <Button variant="contained" endIcon={<RemoveCircleIcon />} sx={{ width: 120, m: 2 }} onClick={async () => {
        const trying = await votingAction(id, currentAccount, "against");
        if (trying == "success") {
          setSnack("vote")
        }
        await readProposal();
      }}>
        No
      </Button>
    </Typography>
    <Box sx={{ justifyContent: 'center' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', justifyContent: 'center' }}>
        <Typography
          variant="h4"
          id="tableTitle"
          component="div"
        >
          成功判定投票
        </Typography>
        <TableContainer >
          <Table sx={{ justifyContent: 'center' }} aria-label="simple table">
            <TableBody>
              {Object.keys(voting).map((doc, i) => {
                return (<TableRow
                  key={doc}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center' component="th" scope="row" sx={{ width: 120, m: 2 }}>
                    {doc.substr(0, 5)}...{doc.substr(-5)}
                  </TableCell>
                  <TableCell align='center' component="th" scope="row" sx={{ width: 120, m: 2 }}>
                    {(voting[doc] == "for" && "Yes")}
                    {(voting[doc] == "against" && "No")}
                  </TableCell>

                </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>

  </div >;
};

export default TaskDetail;
