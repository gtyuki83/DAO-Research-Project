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
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

import { SubmitComment } from "./FirebaseAction.tsx";

import CheckWallet from "../../data/blockchain_actions/checkWallet";


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
  const { teamid } = useParams();
  const { userid } = useParams();

  const [data, setData] = React.useState({});

  async function readComment() {
    const commentsRef = collection(firebaseFirestore, "comments");
    await getDocs(query(commentsRef, where("teamid", "==", teamid), where("to", "==", userid))).then(snapshot => {
      const arr = [];
      snapshot.forEach(async (document) => {
        arr.push({
          comment: document.data().comment,
          from: document.data().from,
        })
        await setData(arr)
      });
    })

    // if (docSnap.exists()) {
    //   setData({
    //     title: docSnap.data().title,
    //     assign: docSnap.data().assign,
    //     priority: docSnap.data().priority,
    //     description: docSnap.data().description,
    //     createdBy: docSnap.data().createdBy,
    //   });
    // } else {
    //   console.log("No such document!");
    // }
  };

  const [description, setDescription] = React.useState('');

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
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

  useEffect(() => {
    readComment();
  }, [currentAccount]);

  useEffect(() => {
  }, [data]);


  return <div>
    <Button variant="contained" endIcon={<ArrowBackIosNewIcon />} component={Link} to={`/teams`} >
      Back
    </Button>
    <Stack spacing={2}>
      {(Object.keys(data).length) != 0 && (
        data.map((da, i) => {
          return (
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {da.comment}
              </Typography>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {da.from}
              </Typography>
            </Box>
          );
        }
        )
      )}
    </Stack>
    <Stack spacing={2}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          💭Leave Your Comment💭
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <TextField multiline maxRows={5} id="fullWidth" label="Comment" variant="outlined" value={description} onChange={handleDescription} />
          </FormControl>
        </Typography>
        {/* userid:to currentAccount:from */}
        <Button onClick={() => SubmitComment(teamid, currentAccount, userid, description)} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />} margin="normal">
          Submit
        </Button>
      </Box>
    </Stack>

  </div >;
};

export default TaskDetail;
