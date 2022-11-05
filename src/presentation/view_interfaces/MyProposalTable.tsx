import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

// Firebase関係
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

import ProposalDetail from "./ProposalDetail.tsx";
import ProposalModal from "./ProposalModal.tsx";
import Proposal from './Proposals';
import CheckWallet from "../../data/blockchain_actions/checkWallet";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


interface Column {
  id: 'Title' | 'Priority' | 'Due' | 'Assigned' | 'CreatedBy' | 'Voting';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'Title', label: 'Title' },
  { id: 'Priority', label: 'Priority' },
  {
    id: 'Due',
    label: 'Due',
  },
  {
    id: 'Assigned',
    label: 'Assigned',
  },
  {
    id: 'CreatedBy',
    label: 'CreatedBy',
  },
  {
    id: 'Accepted',
    label: 'Accepted',
  },
];

interface Data {
  Id: string;
  Title: string;
  Priority: string;
  Due: string;
  Assigned: string;
  CreatedBy: string;
  Accepted: boolean;
  Team: string;
}

function createData(
  Id: string,
  Title: string,
  Priority: string,
  Due: string,
  Assigned: string,
  CreatedBy: string,
  Accepted: boolean,
  Team: string,
): Data {
  return { Id, Title, Priority, Due, Assigned, CreatedBy, Accepted, Team };
}

export default function MyProposalTable() {
  // const rows = [createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi')];
  const [rows, setRows] = React.useState([]);
  const [team, setTeam] = React.useState([]);

  async function readProposal(address) {
    const proposalsRef = collection(firebaseFirestore, "proposals");
    var arr = [];
    // await getDocs(query(proposalsRef), where("createdBy", "==", currentAccount.toLowerCase())).then((snapshot) => {
    await getDocs(query(proposalsRef, where("createdBy", "==", address.toLowerCase()))).then((snapshot) => {
      snapshot.forEach(async (doc: any) => {
        const time = new Date(doc.data().due.seconds * 1000);
        const dateTime = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
        await arr.push(createData(doc.data().id, doc.data().title, doc.data().priority, dateTime, doc.data().assign, doc.data().createdBy, doc.data().accepted.toString(), doc.data().team))
      });
    });
    await setRows(arr);
  };

  // ユーザーのウォレットアドレス取得
  const [currentAccount, setCurrentAccount] = useState(null);
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    CheckWallet().then(function (result) {
      const address = result;
      setCurrentAccount(address);
      readProposal(address);
    });
  };

  // useEffect(() => {
  //   readProposal();
  // }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // アクセスしたユーザーのアドレスから、チーム一覧を取得してコンソールに表示
  const readTeams = async (address) => {
    const usersRef = collection(firebaseFirestore, "users");
    const snapshot = await getDocs(query(usersRef, where("address", "==", address)));
    const arr = [];
    snapshot.forEach(async (document) => {
      document.data().team.map(async (te) => {
        //　IDがteのチームを探す
        const docSnap = await getDoc(doc(firebaseFirestore, "teams", te));
        if (docSnap.exists()) {
          arr.push({
            name: docSnap.data().name,
            id: docSnap.data().id,
          });
        } else {
          // console.log("No such document!");
        }
        await setTeam(arr);
      })
    });
  };

  useEffect(() => {
    readTeams(currentAccount);
  }, [currentAccount]);

  return (
    <ThemeProvider theme={theme}>
      {team.map((tea, index) => {
        return (
          <Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Toolbar sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 }
              }}>

                <Typography
                  sx={{ flex: '1 1 100%' }}
                  align='left'
                  variant="h4"
                  id="tableTitle"
                  component="div"
                >
                  Team {tea.name}
                </Typography>

              </Toolbar >
              <TableContainer sx={{ display: { xs: "none", sm: "flex" } }}>
                <Table stickyHeader aria-label="sticky table" >
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, i) => {
                          // ここで適当な変数を変える処理を入れておけば、Useeffectを叩くと再描画できそう
                          if (row.Team === tea.id) {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                                <Button variant="contained" endIcon={<ArrowForwardIosIcon />} component={Link} to={`/tasks/${row.Id}`} >
                                  Detail
                                </Button>
                              </TableRow>
                            );
                          }
                        })
                    }

                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ display: { xs: "none", sm: "flex" } }}
              />
            </Paper>
            < Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <Grid container>
                <Grid item xs={12}>
                  <Box m={2} pt={3}>
                    {rows.map((row, i) => {
                      return (
                        row.Team === tea.id && (
                          <Grid item xs={12}>
                            <Box m={2} pt={3}>
                              <Card>
                                <CardContent>
                                  <Typography sx={{ mt: 1.5 }} variant="h6" component="div">
                                    {row.Title}
                                  </Typography>
                                  <Typography sx={{ mt: 1.5 }} color="text.secondary">
                                    優先度：{row.Priority}
                                  </Typography>
                                  <Typography sx={{ mt: 1.5 }} variant="body2">
                                    期日：
                                    {row.Due}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button variant="contained" endIcon={<ArrowForwardIosIcon />} component={Link} to={`/tasks/${row.Id}`} >
                                    Detail
                                  </Button>
                                </CardActions>
                              </Card>
                            </Box>
                          </Grid>
                        )
                      )
                    })}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      })}
    </ThemeProvider >
  );
}
