import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import ContestTable from "../components/ContestTable";
import Countdown from "../components/Countdown";
import Button from "@mui/material/Button";

const Contest = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState([]);
    const [problemStatistics, setProblemStatistics] = useState({});

    const [submissions, setSubmissions] = useState([]);
    const [participating, setParticipating] = useState(false);
    const [contestGraded, setContestGraded] = useState(false);

    useEffect(() => {
        const contest_id = params.contest_id;
        Promise.all([
            fetch(`/api/contests/${contest_id}`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problems`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problemStatistics`, { method: "GET" }),
            fetch(`/api/users/contests/${contest_id}/submissions`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
            })
        ]).then(([res1, res2, res3, res4]) => {
            return Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]);
        }).then(([res1, res2, res3, res4]) => {
            if (res1.success && res2.success && res3.success) {
                setContest(res1.contest);
                setContestGraded(res1.contest.graded);
                setProblems(res2.problems);
                setProblemStatistics(res3.problem_statistics);
                setLoading(false);
            } else {
                window.location = "/";
            }

            if (res4.success) {
                res4.submissions.sort((a, b) => a.problem_id - b.problem_id);
                setSubmissions(res4.submissions);
                setParticipating(true);
            }
        });
    }, [params]);

    const gradeContest = (event) => {
        const contest_id = params.contest_id;
        fetch(`/api/contests/${contest_id}/grade`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                setContest({ ...contest, graded: true });
            }
        });
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
                    <Grid item xs={6}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h5">Problems</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />
                                <Grid item xs={12}>
                                    <ContestTable
                                        problems={problems}
                                        submissions={submissions}
                                        participating={participating}
                                        contestGraded={contestGraded}
                                        problemStatistics={problemStatistics}
                                        path={window.location.pathname} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{contest.title} (Div. {contest.division})</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />
                                <Grid item xs={12}>
                                    <Typography variant="body1" sx={{ fontWeight: "lighter" }}>Time Remaining:</Typography>
                                    <Countdown timestamp={contest.end_time} variant="h6" />
                                    {contest.graded &&
                                        <Link to={`/contest/${contest.id}/standings`}>
                                            <Typography variant="h6" sx={{ marginTop: "5px" }}>Final Standings</Typography>
                                        </Link>
                                    }
                                    {Date.now() > contest.end_time && !contest.graded && props.isAdmin &&
                                        <Button variant="outlined" onClick={gradeContest}>Grade Contest</Button>
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            }
        </div>
    );
}

export default Contest;