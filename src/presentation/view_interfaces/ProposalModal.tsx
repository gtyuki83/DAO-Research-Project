import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

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
const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];


export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currency, setCurrency] = React.useState('EUR');
    const [priority, setPriority] = React.useState('Middle');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };

    const handlePriority = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriority(event.target.value);
    };

    return (
        <div>
            <Box display="flex" justifyContent="flex-end">
                <Tooltip title="New Proposal">
                    <Button onClick={handleOpen} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />}>
                        New Proposal
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
                    <Box
                        sx={{
                            maxWidth: '100%',
                        }}
                    >
                        <TextField id="fullWidth" label="Title" variant="outlined" />
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    <TextField id="fullWidth" label="Description" variant="outlined" />
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select"
                        value={currency}
                        onChange={handleChange}
                        helperText="Please select your currency"
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <div>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Select"
                            value={priority}
                            onChange={handlePriority}
                            helperText="Please select your currency"
                        >
                            {priorities.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
