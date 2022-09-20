import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Slide } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

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

import {
  useParams,
} from 'react-router-dom';

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
  p: 4,
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
  });

  async function readProposal() {
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
      });
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    readProposal();
  }, []);

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
    <Button variant="contained" endIcon={<ArrowBackIosNewIcon />} component={Link} to={`/tasks`} >
      Back
    </Button>
    <Stack spacing={2}>

      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {data.title}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          assigned:{data.assign}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          description:{data.description}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          priority:{data.priority}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          createdBy:{data.createdBy}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 10 }}>

        </Typography>
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

  </div >;
};

export default TaskDetail;
