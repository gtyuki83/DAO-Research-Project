import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    // IconButton,
    Box,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" className={classes.title} >
                        <Box textAlign="left" className='title'>CoopX</Box>
                    </Typography>
                    <Button color="inherit">Tasks</Button>
                    <Button color="inherit">Proposals</Button>
                    <Button color="inherit">Team</Button>
                    <Button color="inherit">Your Account</Button>
                </Toolbar>
            </AppBar>
        </div >
    );
}