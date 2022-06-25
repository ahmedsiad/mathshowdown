import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from "@mui/material/CircularProgress";
import Username from "../components/Username";
import Countdown from "../components/Countdown";

const ContestList = (props) => {
    const [loading, setLoading] = useState(true);
    const [pastContests, setPastContests] = useState([]);
    const [currentContests, setCurrentContests] = useState([]);
    const [futureContests, setFutureContests] = useState([]);

    const [registerOpen, setRegisterOpen] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null);

    useEffect(() => {
        fetch("/api/contests", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                console.log(res);

                const pContests = [];
                const cContests = [];
                const fContests = [];

                const now = Date.now();
                for (const contest of res.contests) {
                    if (contest.end_time <= now) {
                        pContests.push(contest);
                    } else if (contest.start_time <= now) {
                        cContests.push(contest);
                    } else {
                        fContests.push(contest);
                    }
                }
                setPastContests([...pContests]);
                setCurrentContests([...cContests]);

                if (props.authorized) {
                    fetch("/api/users/profile", {
                        method: "GET",
                        headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
                    }).then((response) => {
                        return response.json();
                    }).then((res2) => {
                        if (res2.success) {
                            const userHistory = res2.user.contest_history;
                            for (const contest of fContests) {
                                const participantIndex = userHistory.findIndex((p) => p.contest_id === contest.id);
                                console.log(participantIndex);
                                contest.registered = (participantIndex !== -1) ? true : false;
                            }
                            setFutureContests([...fContests]);
                            setLoading(false);
                        }
                    });
                } else {
                    setLoading(false);
                    setFutureContests([...fContests]);
                }
            }
        });
    }, [props]);

    const registerOpenClick = (event, contest_id) => {
        setRegisterOpen(true);
        setSelectedContest(contest_id);
    }

    const registerCloseClick = (event) => {
        setRegisterOpen(false);
        setSelectedContest(null);
    }

    const register = (event) => {
        fetch(`/api/contests/${selectedContest}/register`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                const cIndex = futureContests.findIndex((c) => c.id === selectedContest);
                setFutureContests([
                    ...futureContests.slice(0, cIndex),
                    { ...futureContests[cIndex], registered: true },
                    ...futureContests.slice(cIndex + 1)
                ]);
            }
            setRegisterOpen(false);
            setSelectedContest(null);
        })
    }

    return (
        <div>
            {loading &&
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            }
            {!loading &&
                <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        {currentContests.length > 0 &&
                            <Paper square sx={{ padding: "12px", marginBottom: "30px" }} elevation={3}>
                                <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                                        <Typography variant="h4">Current Contests</Typography>
                                    </Grid>
                                    <Divider sx={{ width: "100%", marginTop: "20px" }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Title</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Authors</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Start</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Duration</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Time Left</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentContests.map((contest, index) => (
                                                <TableRow key={index}
                                                    hover
                                                    sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                                    <TableCell component="th" scope="row" align="center" sx={{ width: "30%" }}>
                                                        <Link to={`/contest/${contest.id}`}>
                                                            <Typography>{contest.title} (Div. {contest.division})</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "15%" }}>
                                                        {contest.authors.map((author) => (
                                                            <Username key={author.username} user={author} />
                                                        ))}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "20%" }}>
                                                        <Typography>{format(contest.start_time, "MMM/dd/yyyy")}</Typography>
                                                        <Typography>{format(contest.start_time, "hh:mm OOOO")}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        <Typography>
                                                            {new Date(contest.end_time - contest.start_time).toISOString().substring(11, 19)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Countdown timestamp={contest.end_time} variant="h6" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Paper>
                        }

                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h4">Upcoming Contests</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginTop: "20px" }} />

                                <Grid item xs={12}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Title</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Authors</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Start</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Duration</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Registration</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {futureContests.map((contest, index) => (
                                                <TableRow key={index}
                                                    hover
                                                    sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                                    <TableCell component="th" scope="row" align="center" sx={{ width: "30%" }}>
                                                        <Typography>{contest.title} (Div. {contest.division})</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "15%" }}>
                                                        {contest.authors.map((author) => (
                                                            <Username key={author.username} user={author} />
                                                        ))}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "20%" }}>
                                                        <Typography>{format(contest.start_time, "MMM/dd/yyyy")}</Typography>
                                                        <Typography>{format(contest.start_time, "hh:mm OOOO")}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        <Typography>
                                                            {new Date(contest.end_time - contest.start_time).toISOString().substring(11, 19)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {!props.authorized &&
                                                            <Link to={"/login"}>
                                                                <Typography>Login to Register!</Typography>
                                                            </Link>
                                                        }
                                                        {props.authorized && contest.registered &&
                                                            <Typography color="green" sx={{ fontWeight: "bold" }}>Registered!</Typography>
                                                        }
                                                        {props.authorized && !contest.registered &&
                                                            <Button variant="contained"
                                                                onClick={(event) => registerOpenClick(event, contest.id)}>Register</Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper square sx={{ padding: "12px", marginTop: "30px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h4">Past Contests</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginTop: "20px" }} />

                                <Grid item xs={12}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Title</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Authors</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Start</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Duration</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pastContests.map((contest, index) => (
                                                <TableRow key={index}
                                                    hover
                                                    sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                                    <TableCell component="th" scope="row" align="center" sx={{ width: "30%" }}>
                                                        <Link to={`/contest/${contest.id}`}>
                                                            <Typography>{contest.title} (Div. {contest.division})</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "15%" }}>
                                                        {contest.authors.map((author) => (
                                                            <Username key={author.username} user={author} />
                                                        ))}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "20%" }}>
                                                        <Typography>{format(contest.start_time, "MMM/dd/yyyy")}</Typography>
                                                        <Typography>{format(contest.start_time, "hh:mm OOOO")}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        <Typography>
                                                            {new Date(contest.end_time - contest.start_time).toISOString().substring(11, 19)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Link to={`/contest/${contest.id}/standings`}>
                                                            <Typography>Final Standings</Typography>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={12} />

                    <Dialog open={registerOpen} onClose={registerCloseClick}>
                        <DialogTitle>Registration</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to register for this contest? You cannot undo this.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={registerCloseClick}>No</Button>
                            <Button onClick={register}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            }
        </div>
    );
}

export default ContestList;