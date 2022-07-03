import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import TopRated from "../components/TopRated";
import RatingText from "../components/RatingText";
import formatMinutes from "../utils/FormatTime";

const UserContest = (props) => {
    const params = useParams();

    const [user, setUser] = useState({});
    const [contest, setContest] = useState({});
    const [submissions, setSubmissions] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { username, contest_id } = params;

        fetch(`/api/users/profile/${username}/contests/${contest_id}/submissions`, {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                res.submissions.sort((a, b) => b.submission_time - a.submission_time);
                setUser(res.user);
                setContest(res.contest);
                setSubmissions(res.submissions);
                setLoading(false);
            } else {
                window.location = "/";
            }
        })
    }, [params]);

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
                    <Grid item xs={6}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h5">
                                        <Link to={`/profile/${user.username}/contests`}>
                                            <RatingText rating={user.rating}>{user.username}'s</RatingText>
                                        </Link>
                                        &nbsp;Submissions
                                    </Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />

                                <Grid item xs={12} sx={{ textAlign: "center", marginTop: "10px" }}>
                                    <Link to={`/contest/${contest.id}`}>
                                        <Typography variant="h6">
                                            {contest.title} (Div. {contest.division})
                                        </Typography>
                                    </Link>
                                </Grid>

                                <Grid item xs={12}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>When</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Problem</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Answer</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Verdict</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {submissions.map((submission, index) => (
                                                <TableRow key={index}
                                                    hover
                                                    sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                                    <TableCell component="th" scope="row" align="center" sx={{ width: "10%" }}>
                                                        {formatMinutes(submission.submission_time - contest.start_time)}
                                                    </TableCell>
                                                    <TableCell sx={{ width: "40%" }}>
                                                        <Link to={`/contest/${contest.id}/problem/${submission.problem_index}`}>
                                                            <Typography variant="body2">
                                                                {`${submission.problem_index} - ${submission.title}`}
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        {submission.answer}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        {submission && submission.verdict &&
                                                            <CheckIcon sx={{ color: "green" }} />
                                                        }
                                                        {!submission.verdict &&
                                                            <ClearIcon sx={{ color: "red" }} />
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

                    <Grid item xs={3}>
                        <TopRated />
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default UserContest;