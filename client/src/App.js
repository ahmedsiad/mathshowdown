import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contest from "./pages/Contest";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthentication = () => {
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }

  useEffect(() => {
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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contest/:id" element={<Contest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;