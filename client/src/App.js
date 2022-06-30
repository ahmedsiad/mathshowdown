import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contest from "./pages/Contest";
import ContestList from "./pages/ContestList";
import ContestStandings from "./pages/ContestStandings";
import Problem from "./pages/Problem";
import Create from "./pages/Create";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthentication = () => {
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
    }).then((response) => {
      return response.json();
    }).then((res) => {
      if (res.success) {
        setAuthenticated(true);
        setIsAdmin(res.is_admin);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    console.log("hi");
    const potential_token = localStorage.getItem("auth_token");
    if (!!potential_token) {
      sessionStorage.setItem("auth_token", potential_token);
    }
    checkAuthentication();
  }, []);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "white", color: "black", }} elevation={0}>
          <Toolbar>
            <Button>Home</Button>
            <Button>Contests</Button>
            <Button>Leaderboards</Button>
            <Button sx={{flexGrow: 1}}>Blog</Button>

            <Button href="/login">Login</Button>
            <Button href="/register">Register</Button>
          </Toolbar>
          <Divider></Divider>
        </AppBar>
        <Toolbar />
      </Box>
      {loading &&
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      }
      {!loading &&
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contests" element={<ContestList authorized={authenticated} />} />
              <Route path="/contest/:contest_id" element={<Contest />} />
              <Route path="/contest/:contest_id/standings" element={<ContestStandings />} />
              <Route path="/contest/:contest_id/problem/:problem_index" element={<Problem />} />
              <Route path="/create/" element={<Create />} />
            </Routes>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;