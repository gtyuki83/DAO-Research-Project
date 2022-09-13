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

import { AddTeam } from "./FirebaseAction.tsx";
import CheckWallet from "../../data/blockchain_actions/checkWallet";
import { useEffect, useState } from 'react';

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


export default function TeamModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [name, setName] = React.useState("");
    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const [description, setDescription] = React.useState("");
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

    return (
        <div>
            <Box display="flex" justifyContent="flex-end">
                <Tooltip title="New Team">
                    <Button onClick={handleOpen} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />}>
                        New Team
                    </Button>
                </Tooltip>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create New Team
                    </Typography>
                    <Box>
                        <FormControl fullWidth>
                            <TextField id="fullWidth" label="Name" variant="outlined" value={name} onChange={handleName} />
                        </FormControl>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    </Typography>
                    <FormControl fullWidth>
                        <TextField id="fullWidth" label="Description(optional)" variant="outlined" value={description} onChange={handleDescription} />
                    </FormControl>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    </Typography>

                    <Button variant="contained" endIcon={<AddCircleIcon />} onClick={async () => {
                        await AddTeam(name, description, currentAccount)
                        await handleClose()
                    }} >
                        Create
                    </Button>

                </Box>
            </Modal>
        </div>
    );
}
