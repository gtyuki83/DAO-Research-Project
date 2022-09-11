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


import TeamModal from "./TeamModal.tsx";

const Teams = () => {
  const hoge: string = "";
  const [addMember, setAddMember] = React.useState(true);
  const check = () => { }
  return <div>
    <TeamModal></TeamModal>
    <TeamTable />
  </div >;
};

export default Teams;
