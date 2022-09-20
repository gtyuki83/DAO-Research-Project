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

import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

import { useEffect, useState } from 'react';

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
  id: 'Comment' | 'To';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'Comment', label: 'Comment' },
  { id: 'To', label: 'To' },
];

interface Data {
  Comment: string;
  To: string;
  Team: string;
}

function createData(
  Comment: string,
  To: string,
  Team: string,
): Data {
  return { Comment, To, Team };
}

export default function MyProposalTable() {
  const [rows, setRows] = React.useState([]);
  const [team, setTeam] = React.useState([]);

  async function readProposal(address) {
    const outputsRef = collection(firebaseFirestore, "comments");
    const q = query(outputsRef, where("from", "==", address.toLowerCase()))
    var arr = [];
    await getDocs(q).then((snapshot) => {
      snapshot.forEach(async (doc: any) => {
        await arr.push(createData(doc.data().comment, doc.data().to, doc.data().teamid))
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

              {/* <ProposalModal></ProposalModal> */}

            </Toolbar >
            <TableContainer sx={{ maxHeight: 440 }}>
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
                              <TableCell>
                                <ProposalDetail id={row.Id} />
                              </TableCell>
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
            />
          </Paper>
        )
      })}
    </ThemeProvider >
  );
}
