import React from "react";

import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ProposalTable from "./ProposalTable.tsx";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Proposal = () => {
  const hoge: string = "";
  const CenteredTabs = (props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <div>
        <Paper className="">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {props.labels.map(label => <Tab label={label}></Tab>)}
          </Tabs>
        </Paper>

        {/* 追加 */}
        {
          props.children.map((child, index) =>
            <TabPanel value={value} index={index}>{child}</TabPanel>)
        }
      </div >
    );
  }
  return <div>
    <CenteredTabs labels={['OnGoing (3)', 'Past (5)']}>
      <div>
        <ProposalTable state='ongoing'></ProposalTable>
      </div>
      <div>
        <ProposalTable state='past'></ProposalTable>
      </div>
    </CenteredTabs >
  </div >;
};

export default Proposal;
