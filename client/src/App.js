import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"; 
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contest from "./pages/Contest";
import ContestList from "./pages/ContestList";
import ContestStandings from "./pages/ContestStandings";
import Problem from "./pages/Problem";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import UserContest from "./pages/UserContest";
import UserContestList from "./pages/UserContestList";
import Leaderboard from "./pages/Leaderboard";
import RatingText from "./components/RatingText";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: "", rating: 0, is_admin: false});
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
        setUser(res.user);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    const potential_token = localStorage.getItem("auth_token");
    if (!!potential_token) {
      sessionStorage.setItem("auth_token", potential_token);
    }
    checkAuthentication();
    console.log(potential_token);
  }, []);

  return (
    <BrowserRouter>
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "white", color: "black", }} elevation={0}>
          <Toolbar>
            <Typography sx={{marginLeft: "100px", flexGrow: 1}}>
              <Link to={"/"} style={{padding: "50px"}} >Home</Link>
              <Link to={"/contests"} style={{padding: "50px"}}>Contests</Link>
              <Link to={"/leaderboard"} style={{padding: "50px"}}>Leaderboard</Link>
              {user.is_admin &&
                <Link to={"/create"} style={{padding: "50px"}}>Create</Link>
              }
            </Typography>
            {!authenticated &&
              <Typography>
                <Link to={"/login"} style={{padding: "20px"}}>Login</Link>
                <Link to={"/register"} style={{padding: "20px"}}>Register</Link>
              </Typography>
            }
            {authenticated &&
            <Typography>
              <Link to={`/profile/${user.username}`} style={{padding: "20px"}}><RatingText rating={user.rating}>{user.username}</RatingText></Link>
              <Link to={`/logout`} style={{padding: "20px"}}>Logout</Link>
            </Typography>
            }
          </Toolbar>
          <Divider />
        </AppBar>
        <Toolbar />
      </Box>
      {loading &&
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      }
      {!loading &&
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contests" element={<ContestList authorized={authenticated} />} />
              <Route path="/contest/:contest_id" element={<Contest isAdmin={user.is_admin} />} />
              <Route path="/contest/:contest_id/standings" element={<ContestStandings />} />
              <Route path="/contest/:contest_id/problem/:problem_index" element={<Problem />} />
              <Route path="/create/" element={(user.is_admin) ? <Create isAdmin={user.is_admin} /> : <Navigate to="/" replace />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/profile/:username/contests" element={<UserContestList />} />
              <Route path="/profile/:username/contest/:contest_id" element={<UserContest />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
      } 
    </div>
    </BrowserRouter>
  );
}

export default App;