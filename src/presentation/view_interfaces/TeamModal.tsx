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

// Priority
const priorities = [
    {
        value: 'High',
        label: '🔥High🔥',
    },
    {
        value: 'Middle',
        label: 'Middle',
    },
    {
        value: 'Low',
        label: 'Low',
    },
];

const members = [
    {
        value: 'Yoshi',
        label: 'Yoshi',
    },
    {
        value: 'UYZ',
        label: 'UYZ',
    },
    {
        value: 'Funa',
        label: 'Funa',
    },
    {
        value: 'Everyone',
        label: 'Everyone',
    },
];


export default function TeamModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [priority, setPriority] = React.useState('Middle');

    const handlePriority = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriority(event.target.value);
    };

    // Assign
    const [assign, setAssign] = React.useState('');

    const handleAssign = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAssign(event.target.value);
    };

    // Date
    const [date, setDate] = React.useState<Date | null>(
        new Date(''),
    );

    const handleDate = (newValue: Date | null) => {
        setDate(newValue);
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
                        New Proposal
                    </Typography>
                    <Box>
                        <FormControl fullWidth>
                            <TextField id="fullWidth" label="Title" variant="outlined" />
                        </FormControl>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    </Typography>
                    <FormControl fullWidth>
                        <TextField id="fullWidth" label="Description" variant="outlined" />
                    </FormControl>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    </Typography>

                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Priority"
                        value={priority}
                        onChange={handlePriority}
                        helperText="Please select the priority of this task"
                    >
                        {priorities.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Assign"
                        value={assign}
                        onChange={handleAssign}
                        helperText="Please select who to assign the task"
                    >
                        {members.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Due"
                            inputFormat="MM/dd/yyyy"
                            value={date}
                            onChange={handleDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
            </Modal>
        </div>
    );
}
