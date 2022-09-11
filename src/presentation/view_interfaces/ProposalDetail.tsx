import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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

import { AcceptProposal } from "./FirebaseAction.tsx";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    color: 'white',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    background: 'linear-gradient(45deg, #ff7f50,#ff1493)',
    boxShadow: 24,
    p: 4,
};


export default function ProposalDetail(id) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [data, setData] = React.useState({
        assign: '',
        title: '',
        priority: '',
        description: '',
        createdBy: '',
    });
    // setValues({ ...values, title: 'changed title' });

    async function readProposal() {
        const docRef: any = doc(firebaseFirestore, "proposals", id.id);
        const docSnap: any = await getDoc(docRef);

        if (docSnap.exists()) {
            setData({
                title: docSnap.data().title,
                assign: docSnap.data().assign,
                priority: docSnap.data().priority,
                description: docSnap.data().description,
                createdBy: docSnap.data().createdBy,
            });
        } else {
            console.log("No such document!");
        }
    };
    // useEffect(() => {
    //     console.log("毎回実行");
    //     readProposal();
    // }, []);

    return (
        <div>
            <Box display="flex" justifyContent="flex-end" onClick={handleOpen}>
                <Tooltip title="Detail">
                    <Button onClick={() => {
                        handleOpen();
                        readProposal();
                    }} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />}>
                        Detail
                    </Button>
                </Tooltip>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* <Box sx={style} component={Link} to="/tasks"> */}
                {/* これでリンクを作れるよ！ */}
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        New Proposal
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.title}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.description}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.assign}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.createdBy}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.priority}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button variant="contained" endIcon={<AddCircleIcon />}>
                            For
                        </Button>

                        <Button variant="contained" endIcon={<AddCircleIcon />}>
                            Against
                        </Button>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => { AcceptProposal(id) }}>
                            Accept
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
