import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import ContestTable from "../components/ContestTable";

const Contest = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const contest_id = params.id;
        Promise.all([
            fetch("/api/contests/" + contest_id, { method: "GET" }),
            fetch("/api/contests/" + contest_id + "/problems", { method: "GET" })
        ]).then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()]);
        }).then(([res1, res2]) => {
            if (res1.success && res2.success) {
                console.log(res1, res2);
                setContest(res1.contest);
                setProblems(res2.problems);
                setLoading(false);
            } else {
                window.location = "/";
            }
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
                                    <ContestTable problems={problems} path={window.location.pathname} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{contest.title}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />
                                <Grid item xs={12}>
                                    <Typography variant="body1" sx={{ fontWeight: "lighter" }}>Time Remaining:</Typography>
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