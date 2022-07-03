import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import StandingsTable from "../components/StandingsTable";
import RatingText from "../components/RatingText";

const ContestStandings = (props) => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const contest_id = params.contest_id;
        let page = searchParams.get("page");
        page = (page) ? page : 0;

        Promise.all([
            fetch(`/api/contests/${contest_id}`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problems`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/standings?page=${page}`, { method: "GET" })
        ]).then(([res1, res2, res3]) => {
            return Promise.all([res1.json(), res2.json(), res3.json()]);
        }).then(([res1, res2, res3]) => {
            if (res1.success && res1.contest.graded && res2.success && res3.success) {
                setContest(res1.contest);
                setProblems(res2.problems);

                for (const participant of res3.participants) {
                    const submissions = [];
                    for (const prob of res2.problems) {
                        const sub = participant.submissions.find((s) => s.problem_id === prob.id);
                        if (sub) {
                            submissions.push(sub);
                        } else {
                            submissions.push(null);
                        }
                    }
                    participant.submissions = submissions;
                }
                setParticipants(res3.participants);
                setLoading(false);
            } else {
                window.location = "/";
            }
            console.log(res3);
        });
    }, [params, searchParams]);


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
                    <Grid item xs={10}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Link to={`/contest/${contest.id}`}>
                                        <Typography variant="h5">{contest.title} (Div. {contest.division})</Typography>
                                    </Link>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h6">Final Standings</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <StandingsTable
                                        contest={contest}
                                        participants={participants}
                                        problems={problems}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            }
        </div>
    );
}

export default ContestStandings;