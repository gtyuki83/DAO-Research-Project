import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

import CheckWallet from "../../../data/blockchain_actions/checkWallet";
import Login from "../../../data/blockchain_actions/login";
import "./Header.css";

// リンクへのアクセス
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  mode: 'dark',
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
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Drawer の開閉状態を反転
  };

  useEffect(() => {
    // CheckWallet();
    check();
    // console.log(currentAccount)
  }, [currentAccount]);

  useEffect(() => {
    console.log(currentAccount);
  }, [currentAccount]);

  const connect = () => {
    Login().then(function (result) {
      const address = result;
      setCurrentAccount(address);
    });
  };

  const check = () => {
    CheckWallet().then(function (result) {
      const address = result;
      setCurrentAccount(address);
    });
  };

  const test = async () => {
    console.log(currentAccount);
  };

  return (
    <div className="">
      <AppBar position="static">
        <Toolbar className="header">
          <Typography variant="h5" className={classes.title}>
            <Box textAlign="left" className="title">
              Unyte
            </Box>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} >
            <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
            <Button color="inherit" component={Link} to="/proposals">Proposals</Button>
            <Button color="inherit" component={Link} to="/teams">Team</Button>
            {currentAccount && (
              <Button color="inherit" component={Link} to="/mypage">
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}
              </Button>
            )}
            {!currentAccount && (
              <Button color="inherit" onClick={() => connect()}>
                Login
              </Button>
            )}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleDrawerToggle}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
          >
            <List >
              <ListItem>
                <HomeIcon />
                <Button color="inherit" component={Link} to="/" onClick={handleDrawerToggle}>Home</Button>
              </ListItem>
              <ListItem>
                <InfoIcon />
                <Button color="inherit" component={Link} to="/tasks" onClick={handleDrawerToggle}>Tasks</Button>
              </ListItem>
              <ListItem>
                <InfoIcon />
                <Button color="inherit" component={Link} to="/proposals" onClick={handleDrawerToggle}>Proposals</Button>
              </ListItem>
              <ListItem>
                <InfoIcon />
                <Button color="inherit" component={Link} to="/teams" onClick={handleDrawerToggle}>Team</Button>
              </ListItem>
              <ListItem>
                <InfoIcon />
                {currentAccount && (
                  <Button color="inherit" component={Link} to="/mypage" onClick={handleDrawerToggle}>
                    {currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}
                  </Button>
                )}
                {!currentAccount && (
                  <Button color="inherit" onClick={() => connect()}>
                    Login
                  </Button>
                )}
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </div >
  );
}
