import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import ContestTable from "../components/ContestTable";
import Countdown from "../components/Countdown";

const Contest = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState([]);

    const [submissions, setSubmissions] = useState([]);
    const [participating, setParticipating] = useState(false);
    const [contestGraded, setContestGraded] = useState(false);

    useEffect(() => {
        const contest_id = params.id;
        Promise.all([
            fetch(`/api/contests/${contest_id}`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problems`, { method: "GET" }),
            fetch(`/api/users/contests/${contest_id}/submissions`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
            })
        ]).then(([res1, res2, res3]) => {
            return Promise.all([res1.json(), res2.json(), res3.json()]);
        }).then(([res1, res2, res3]) => {
            if (res1.success && res2.success) {
                console.log(res1, res2);
                setContest(res1.contest);
                setProblems(res2.problems);
                setLoading(false);
            } else {
                window.location = "/";
            }

            if (res3.success) {
                res3.submissions.sort((a, b) => a.problem_id - b.problem_id);
                setSubmissions(res3.submissions);
                setParticipating(true);
            }

            console.log(res3);
        });
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