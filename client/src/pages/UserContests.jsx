import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import format from "date-fns/format";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import RatingText from "../components/RatingText";
import Username from "../components/Username";
import getRank from "../utils/Ranks";

const UserContests = (props) => {
    const params = useParams();

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { username } = params;

        fetch(`/api/users/profile/${username}`, {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                res.user.contest_history = res.user.contest_history.reverse();

                setUser(res.user);
                setLoading(false);
            } else {
                window.location = "/";
            }
        })
    }, []);

    return (
        <div>
            {loading &&
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            }
            {!loading &&
                <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                    <Grid item xs={1} />
                    <Grid item xs={7}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h5">
                                        <Username rating={user.rating} variant="h5" display="inline-flex">
                                            {user.username}
                                        </Username>
                                        <RatingText rating={user.rating}>'s</RatingText>
                                        &nbsp;Contests
                                    </Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />

                                <Grid item xs={12}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Contest</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Rank</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Solved</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Δ</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>New Rating</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {user.contest_history.map((contest, index) => (
                                                <TableRow key={index}
                                                    hover
                                                    sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                                    <TableCell component="th" scope="row" align="center" sx={{ width: "5%" }}>
                                                        {user.contest_history.length - index}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "30%" }}>
                                                        <Link to={`/contest/${contest.contest_id}`}>
                                                            <Typography variant="body2">{contest.title} (Div. {contest.division})</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "25%" }}>
                                                        <Typography variant="body2">{format(contest.start_time, "MMM/dd/yyyy")}</Typography>
                                                        <Typography variant="body2">{format(contest.start_time, "HH:mm OOOO")}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "5%" }}>
                                                        {contest.rank}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "5%" }}>
                                                        {contest.solved}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "5%" }}>
                                                        {contest.rating_after - contest.rating_before >= 0 &&
                                                            <Typography variant="body2" sx={{ color: "green", fontWeight: "bold" }}>
                                                                +{contest.rating_after - contest.rating_before}
                                                            </Typography>
                                                        }
                                                        {contest.rating_after - contest.rating_before < 0 &&
                                                            <Typography variant="body2" sx={{ color: "gray", fontWeight: "bold" }}>
                                                                {contest.rating_after - contest.rating_before}
                                                            </Typography>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "5%" }}>
                                                        <RatingText rating={contest.rating_after}>{contest.rating_after}</RatingText>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "20%" }}>
                                                        {getRank(contest.rating_after) !== getRank(contest.rating_before) &&
                                                            <Typography variant="body2">
                                                                Became&nbsp;
                                                                <RatingText rating={contest.rating_after}>{getRank(contest.rating_after)}</RatingText>
                                                            </Typography>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default UserContests;
