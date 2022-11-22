import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// リンクへのアクセス
import { Link } from "react-router-dom";

// Firebase関係
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

// MUI
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
// ダークモード判定
import useMediaQuery from '@mui/material/useMediaQuery';

import AddMemberModal from "./AddMemberModal.tsx";
import CheckWallet from "../../data/blockchain_actions/checkWallet";
import { useEffect, useState } from 'react';
// import { async } from './FirebaseAction';

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

interface Data {
  address: string;
  name: string;
  role: string;
  id: string;
  team: array;
  PXC: string;
  gainedPXC: string;
}

function createData(
  address: string,
  name: string,
  role: string,
  id: string,
  team: array,
  PXC: string,
  gainedPXC: string,
): Data {

  return {
    address,
    name,
    role,
    id,
    team,
    PXC,
    gainedPXC,
  };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'address',
    numeric: false,
    disablePadding: false,
    label: 'Address',
  },
  {
    id: 'PXC',
    numeric: false,
    disablePadding: false,
    label: 'PXC',
  },
  {
    id: 'gainedPXC',
    numeric: false,
    disablePadding: false,
    label: 'gainedPXC',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <ThemeProvider theme={theme}>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
    </ThemeProvider>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;
  const { teamName } = props;
  const { teamId } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        align='left'
        variant="h4"
        id="tableTitle"
        component="div"
      >
        Team {teamName}
      </Typography>
      <Tooltip title="Add member">
        <AddMemberModal teamId={teamId} />
      </Tooltip>
    </Toolbar>
  );
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('address');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [team, setTeam] = React.useState([]);

  // 配列に値をセットする形ではどう？rowsに合わせる
  const [rows, setRows] = React.useState([""]);

  async function readMember() {
    const usersRef = collection(firebaseFirestore, "users");
    var arr = [];
    await getDocs(query(usersRef)).then((snapshot) => {
      snapshot.forEach(async (doc: any) => {
        // コメントを文字列に保存
        // console.log(Object.keys(doc.data()).includes("taskPXC"))
        if (Object.keys(doc.data()).includes("taskPXC")) {
          await arr.push(createData(doc.data().address, doc.data().name, doc.data().role, doc.data().id, doc.data().team, doc.data().PXC, doc.data().taskPXC.toString()))
        } else {
         await arr.push(createData(doc.data().address, doc.data().name, doc.data().role, doc.data().id, doc.data().team, doc.data().PXC, "0")) 
        }
      });
    });
    await setRows(arr);
    // console.log(arr)
    // return (arr[0])
  };

  useEffect(() => {
    // console.log("毎回実行");
    readMember();
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // ユーザーのウォレットアドレス取得
  const [currentAccount, setCurrentAccount] = useState(null);
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    CheckWallet().then(function (result) {
      const address = result;
      setCurrentAccount(address);
    });
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
    <Box sx={{ width: '100%' }}>
      {team.map((tea, index) => {
        return (
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} teamName={tea.name} teamId={tea.id} />
            <TableContainer sx={{ display: { xs: "none", sm: "flex" } }}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      // チーム所属メンバーのみ表示
                      if (row.team.includes(tea.id)) {
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.name)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="normal"
                            >
                              {row.name}
                            </TableCell>
                            <TableCell>{row.role}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>{row.PXC}</TableCell>
                            <TableCell>{row.gainedPXC}</TableCell>
                            <TableCell align='right'>
                              <Button variant="contained" endIcon={<ArrowForwardIosIcon />} component={Link} to={`/teams/${tea.id}/${row.id}`} >
                                Comment
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/*  */}
            <TableContainer component={Paper} sx={{ display: { xs: "flex", sm: "none" } }}>
              <Table size="small">
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow>
                        <TableContainer>
                          <Table size="small" style={{ tableLayout: "fixed" }}>
                            <TableBody component={Link} to={`/teams/${tea.id}/${row.id}`}>
                              {/* ここからテーブル */}
                              <TableRow>
                                <TableCell component="th" scope="row" style={{ width: "30%", borderBottom: "none" }}>
                                  address
                                </TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{row.address.substr(0, 5)}...{row.address.substr(-5)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row" style={{ width: "30%", borderBottom: "none" }}>
                                  name
                                </TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{row.name}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row" style={{ width: "30%" }}>
                                  PXC
                                </TableCell>
                                <TableCell>{row.PXC}PXC</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row" style={{ width: "30%" }}>
                                  taskで得たPXC
                                </TableCell>
                                <TableCell>{row.gainedPXC}PXC</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
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
    </Box >
  );
}
