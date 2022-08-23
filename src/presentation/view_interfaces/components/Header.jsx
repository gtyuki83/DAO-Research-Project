import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

import CheckWallet from "../../../data/blockchain_actions/checkWallet";
import Login from "../../../data/blockchain_actions/login";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    // marginRight: spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // CheckWallet();
    connect();
    // console.log(currentAccount)
  }, []);

  useEffect(() => {
    console.log(currentAccount);
  }, [currentAccount]);

  const connect = async () => {
    Login().then(function (result) {
      const address = result;
      setCurrentAccount(address);
    });
  };

  const test = async () => {
    console.log(currentAccount);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            <Box textAlign="left" className="title">
              Unyte
            </Box>
          </Typography>
          <Button color="inherit">Tasks</Button>
          <Button color="inherit">Proposals</Button>
          <Button color="inherit">Team</Button>
          {currentAccount && (
            <Button color="inherit" onClick={test}>
              {currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}
            </Button>
          )}
          {!currentAccount && (
            <Button color="inherit" onClick={connect}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
