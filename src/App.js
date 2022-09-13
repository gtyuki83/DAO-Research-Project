import * as React from 'react';
import logo from "./logo.svg";
// import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// presentation
import "./presentation/view_interfaces/styles/index.styl";
import "./presentation/view_interfaces/styles/App.css";
import Header from "./presentation/view_interfaces/components/Header";
import Teams from "./presentation/view_interfaces/Teams.tsx";
import TeamComments from "./presentation/view_interfaces/TeamComments.tsx";
import Proposals from "./presentation/view_interfaces/Proposals.tsx";
import Tasks from "./presentation/view_interfaces/Tasks.tsx";
import TaskDetail from "./presentation/view_interfaces/TaskDetail.tsx";
import MyPage from "./presentation/view_interfaces/MyPage.tsx";
import CreateTask from "./presentation/view_interfaces/CreateTask.tsx";
import Box from '@mui/material/Box';

// MUI
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import SlideRoutes from 'react-slide-routes';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      background: 'linear-gradient(to right bottom, #ff7f50,#f44336)',
      light: '#ff7f50',
      main: '#ff7f50',
      dark: '#ff7f50',
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

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className="App">
          {/* <BrowserRouter> */}
          <Box height="100vh" display="flex" flexDirection="column">
            <Header />
            <Box flex={1} overflow="auto">
              <SlideRoutes>
                <Route path="/" element={<div>Home</div>} />
                <Route exact path="/tasks" element={<Tasks />} />
                <Route exact path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/proposals" element={<Proposals />} />
                <Route exact path="/teams" element={<Teams />} />
                <Route exact path="/teams/:teamid/:userid" element={<TeamComments />} />
                <Route path="/mypage" element={<MyPage />} />
              </SlideRoutes>
            </Box>
          </Box>
          {/* </BrowserRouter> */}
        </div >
      </ThemeProvider>
    </div>
  );
}

export default App;
