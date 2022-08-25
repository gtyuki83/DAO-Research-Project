import React from "react";

import TeamTable from "./TeamTable.tsx";

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { Check } from "@mui/icons-material";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';


const Teams = () => {
  const hoge: string = "";
  const [addMember, setAddMember] = React.useState(true);
  const check = () => { }
  return <div>
    <TeamTable />
    {addMember &&
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          ><TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={false}
                // onChange={Check}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>
            <TableCell
              component="th"
              id={`enhanced-table-checkbox-1`}
              scope="row"
              padding="normal"
            >
              <TextField id="standard-basic" label="Name" variant="standard" />
            </TableCell>
            <TableCell>
              <TextField id="standard-basic" label="Address" variant="standard" />
            </TableCell>
            <TableCell>
              <TextField id="standard-basic" label="Role" variant="standard" />
            </TableCell>
          </Table>
        </Paper>
      </Box>
    }
  </div >;
};

export default Teams;
