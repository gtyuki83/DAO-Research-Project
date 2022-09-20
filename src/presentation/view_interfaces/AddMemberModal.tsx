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

import { AddMember } from "./FirebaseAction.tsx";

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

// Role
const roles = [
    {
        value: 'Admin',
        label: 'Admin',
    },
    {
        value: 'Contributor',
        label: 'Contributor',
    },
    {
        value: 'Member',
        label: 'Member',
    },
];



export default function AddMemberModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [name, setName] = React.useState('');

    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const [address, setAddress] = React.useState('');

    const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const [role, setRole] = React.useState('Member');

    const handleRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
    };

    return (
        <div>
            <Box display="flex" justifyContent="flex-end">
                <Tooltip title="Add Member">
                    <Button onClick={handleOpen} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />}>
                        Add
                    </Button>
                </Tooltip>
            </Box>
            <Modal
                open={open}
                onClose={() => {
                    handleClose();
                    setAddress('');
                    setName('');
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Member
                    </Typography>
                    <Box>
                        <FormControl fullWidth>
                            <TextField id="fullWidth" label="Name" value={name}
                                onChange={handleName} variant="outlined" margin="normal" />
                        </FormControl>
                    </Box>

                    <FormControl fullWidth>
                        <TextField fullWidth id="fullWidth" label="Wallet" value={address}
                            onChange={handleAddress} variant="outlined" margin="normal" />
                    </FormControl>


                    <TextField
                        id="outlined-select-currency"
                        select
                        label="role"
                        value={role}
                        onChange={handleRole}
                        helperText="Please select the role of this member"
                        margin="normal"
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

                    <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => {
                        AddMember(name, address, role, props.teamId);
                    }} >
                        Add
                    </Button>

                </Box>
            </Modal>
        </div >
    );
}
