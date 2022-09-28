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

import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

import { useEffect, useState } from 'react';
// リンクへのアクセス
import { Link } from "react-router-dom";

// Firebase関係
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  color: 'white',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  background: 'linear-gradient(45deg, #ff7f50,#ff1493)',
  boxShadow: 24,
  p: 4,
};

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
  id: 'Link' | 'Description' | 'CreatedBy' | 'Accepted';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'Link', label: 'Link' },
  { id: 'Description', label: 'Description' },
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
  Link: string;
  Description: string;
  CreatedBy: string;
  Accepted: boolean;
  OutputId: string;
}

function createData(
  Link: string,
  Description: string,
  CreatedBy: string,
  Accepted: boolean,
  OutputId: string,
): Data {
  return { Link, Description, CreatedBy, Accepted, OutputId };
}

export default function StickyHeadTable(taskid) {
  const [rows, setRows] = React.useState([]);

  async function readProposal() {
    const outputsRef = collection(firebaseFirestore, "outputs");
    const q = query(outputsRef, where("taskid", "==", taskid.taskid))
    var arr = [];
    await getDocs(q).then((snapshot) => {
      snapshot.forEach(async (doc: any) => {
        const link = doc.data().link.slice(0, 20) + "..."
        const desc = doc.data().description.slice(0, 30) + "..."
        await arr.push(createData(link, desc, doc.data().account, "False", doc.data().outputid))
      });
    });
    await setRows(arr);
  };
  useEffect(() => {
    readProposal();
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // モーダル処理と表示内容記載
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [outputId, setOutputId] = React.useState(null);
  const [arr, setArr] = React.useState({});

  async function readOutput() {
    const docRef = doc(firebaseFirestore, "outputs", outputId);
    const docSnap = await getDoc(docRef);
    const link = docSnap.data().link
    const desc = docSnap.data().description
    // await setArr({ link: link, desc: desc, account: docSnap.data().account, state: "False", id: docSnap.data().outputid })
    return ({ link: link, desc: desc, account: docSnap.data().account, state: "False", id: docSnap.data().outputid })
  };

  useEffect(() => {
    const func = new Promise((resolve, reject) => {
      const arr = readOutput();
      if (arr != null) {
        resolve(arr)
      } else {
        reject(new Error('error'));
      }
    });
    func.then((value) => {
      console.log(value);  // 1
      setArr(value);
    }, (error) => {
      console.error("error:", error.message);
    });
  }, [outputId]);

  const TaskOutputModal = () => {

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Detail
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              link:
              {arr.link != null && (arr.link.substr(0, 8), "...", arr.link.substr(-8))}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Descripition:
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {arr.desc}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
  // モーダル処理と表示内容記載部分終わり

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Toolbar sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        }}>

          <Typography
            sx={{ flex: '1 1 100%' }}
            align='center'
            variant="h4"
            id="tableTitle"
            component="div"
          >
            Outputs
          </Typography>

          <TaskOutputModal></TaskOutputModal>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row['OutputId']} onClick={() => { handleOpen(); setOutputId(row['OutputId']); }} style={{ textDecoration: 'none' }}>
                      <TableCell>
                        {row['Link']}
                      </TableCell>
                      <TableCell>
                        {row['Description']}
                      </TableCell>
                      <TableCell>
                        {row['CreatedBy']}
                      </TableCell>
                      <TableCell>
                        {row['Accepted']}
                      </TableCell>
                    </TableRow>
                  );
                })}

            </TableBody>
          </Table>
        </TableContainer >
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
      </Paper >
      <Box sx={{ display: { xs: "flex", sm: "none" } }}>
        <Grid container>
          <Grid item xs={12}>
            <Box m={2} pt={3}>
              {rows.map((row, i) => {
                return (
                  <Grid item xs={12}>
                    <Box m={2} pt={3}>
                      <Card>
                        <CardContent onClick={() => { handleOpen(); setOutputId(row['OutputId']); }}>
                          <Typography sx={{ mt: 1.5 }} variant="h6" component="div">
                            {row['Link']}
                          </Typography>
                          <Typography sx={{ mt: 1.5 }} color="text.secondary">
                            {row['Description']}
                          </Typography>
                          <Typography sx={{ mt: 1.5 }} variant="body2">
                            {row['CreatedBy']}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {/* <ProposalDetail id={content.content.Id} /> */}
                        </CardActions>
                      </Card>
                    </Box>
                  </Grid>
                )
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider >
  );
}
