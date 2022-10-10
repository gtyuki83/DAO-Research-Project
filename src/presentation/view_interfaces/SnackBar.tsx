import React from "react";
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Proposal from './Proposals';

export function OutputAlert(props) {
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        props.setSnack(false);
    };
    return (
        <Box>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={props.snack == "output"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Your output has been submitted successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={props.snack == "proposal"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Your proposal has been submitted successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={props.snack == "team"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Created new team successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={props.snack == "member"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Add a member to your team successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={props.snack == "comment"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Left a comment successfully!
                    </Alert>
                </Snackbar>
                <Snackbar open={props.snack == "vote"} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Voted successfully!
                    </Alert>
                </Snackbar>
            </Stack>
            <Stack spacing={2}></Stack>
        </Box>
    )
}