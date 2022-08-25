import * as React from 'react';
import logo from "./logo.svg";
// import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// presentation
import "./presentation/view_interfaces/styles/index.styl";
import "./presentation/view_interfaces/styles/App.css";
import Header from "./presentation/view_interfaces/components/Header";
import Teams from "./presentation/view_interfaces/Teams.tsx";
import Proposals from "./presentation/view_interfaces/Proposals.tsx";
import Tasks from "./presentation/view_interfaces/Tasks.tsx";
import TaskDetail from "./presentation/view_interfaces/TaskDetail.tsx";
import MyPage from "./presentation/view_interfaces/MyPage.tsx";
import CreateTask from "./presentation/view_interfaces/CreateTask.tsx";

// MUI
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

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
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="tasks/new" element={<CreateTask />} />
              <Route path="/tasks/${taskId}" element={<TaskDetail />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </BrowserRouter>
        </div >
      </ThemeProvider>
    </div>
  );
}

export default App;
