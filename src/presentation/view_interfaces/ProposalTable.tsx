import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

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
  id: 'Title' | 'Priority' | 'Due' | 'Assigned' | 'CreatedBy';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'Title', label: 'Title', minWidth: 170 },
  { id: 'Priority', label: 'Priority', minWidth: 170 },
  {
    id: 'Due',
    label: 'Due',
    minWidth: 170,
  },
  {
    id: 'Assigned',
    label: 'Assigned',
    minWidth: 170,
  },
  {
    id: 'CreatedBy',
    label: 'CreatedBy',
    minWidth: 170,
  },
];

interface Data {
  Title: string;
  Priority: string;
  Due: string;
  Assigned: string;
  CreatedBy: string;
}

function createData(
  Title: string,
  Priority: string,
  Due: string,
  Assigned: string,
  CreatedBy: string,
): Data {
  return { Title, Priority, Due, Assigned, CreatedBy };
}

const rows = [
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
  createData('プロダクト機能考案', '🔥High🔥', '8/13 17:00', '0xUWYZ', 'Yoshi'),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
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
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.Priority}>
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
                    </TableRow>
                  );
                })}
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
    </ThemeProvider>
  );
}
