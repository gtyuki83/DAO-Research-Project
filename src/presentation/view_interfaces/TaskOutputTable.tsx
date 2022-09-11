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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
  width: 600,
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

  const TaskOutputModal = () => {
    const docRef = doc(firebaseFirestore, "outputs", "EW77C630mk9XeG7PVwX6");
    const docSnap = getDoc(docRef);
    // const link = docSnap.data().link
    // const desc = docSnap.data().description
    // setArr({ link: link, desc: desc, account: docSnap.data().account, state: "False", id: docSnap.data().outputid })
    console.log(arr)

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Detail
            </Typography>
            {/* {arr.link} */}
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
        />
      </Paper >
    </ThemeProvider >
  );
}
