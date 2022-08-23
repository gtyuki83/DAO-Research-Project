import logo from "./logo.svg";
// import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// presentation
import "./presentation/view_interfaces/styles/index.styl";
import "./presentation/view_interfaces/styles/App.css";
import Header from "./presentation/view_interfaces/components/Header";
import Teams from "./presentation/view_interfaces/Teams.tsx";
import Tasks from "./presentation/view_interfaces/Tasks.tsx";
import TaskDetail from "./presentation/view_interfaces/TaskDetail.tsx";
import MyPage from "./presentation/view_interfaces/MyPage.tsx";
import CreateTask from "./presentation/view_interfaces/CreateTask.tsx";

// MUI
import { ThemeProvider, createMuiTheme, makeStyles } from '@mui/styles';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<CreateTask />} />
          <Route path="/tasks/${taskId}" element={<TaskDetail />} />
          <Route path="/my-page" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
