/* global MathJax */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Countdown from "../components/Countdown";


const Problem = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problem, setProblem] = useState({});

    const [inputs, setInputs] = useState({ answer: "" });
    const [errors, setErrors] = useState({ answer: false });
    const [helpers, setHelpers] = useState({ answer: "" });

    const k = "\\(4^{127} + 5^{129} + 7^{231}\\)";

    useEffect(() => {
        const { contest_id, problem_index } = params;

        Promise.all([
            fetch("/api/contests/" + contest_id, { method: "GET" }),
            fetch("/api/contests/" + contest_id + "/problems/" + problem_index, { method: "GET" })
        ]).then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()]);
        }).then(([res1, res2]) => {
            if (res1.success && res2.success) {
                console.log(res1, res2);
                setContest(res1.contest);
                setProblem(res2.problem);
                setLoading(false);
            } else {
                window.location = "/";
            }
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            MathJax.Hub.Typeset();
        }
    }, [loading]);


    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: false });
        setHelpers({ ...helpers, [event.target.name]: "" });
    }

    const submit = (event) => {

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
                                    <Typography variant="h5"><b>Problem {problem.problem_index}</b>: {problem.title}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginTop: "10px" }} />
                                <Grid item xs={12} sx={{ marginTop: "10px" }}>
                                    <Typography>What is the integer formed by the rightmost two digits of the integer equal to {k}?</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ marginTop: "30px", textAlign: "center" }}>
                                    <TextField
                                        value={inputs.answer}
                                        name="answer"
                                        onChange={handleChange}
                                        label="Answer"
                                        type="number"
                                        variant="standard"
                                        error={errors.answer}
                                        helperText={helpers.answer}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ marginTop: "10px", textAlign: "center" }}>
                                    <Button variant="contained" onClick={submit}>Lock In</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                                <Grid item xs={12}>
                                    <Link
                                        href={`/contest/${contest.id}`}
                                        variant="h6"
                                        sx={{ textDecoration: "none" }}>{contest.title} (Div. {contest.division})</Link>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />
                                <Grid item xs={12}>
                                    <Typography variant="body1" sx={{ fontWeight: "lighter" }}>Time Remaining:</Typography>
                                    <Countdown timestamp={1655529705753} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            }
        </div >
    );
}

export default Problem;