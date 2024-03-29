/* global MathJax */
import { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Countdown from "../components/Countdown";

const Problem = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});
    const [problem, setProblem] = useState({});

    const [inputs, setInputs] = useState({ answer: "" });
    const [errors, setErrors] = useState({ answer: false });
    const [helpers, setHelpers] = useState({ answer: "" });

    const [locked, setLocked] = useState(false);
    const [buttonLocked, setButtonLocked] = useState(false);
    const [contestOver, setContestOver] = useState(false);
    const [participating, setParticipating] = useState(true);
    const [viewEditorial, setViewEditorial] = useState(false);


    useEffect(() => {
        const { contest_id, problem_index } = params;

        Promise.all([
            fetch(`/api/contests/${contest_id}`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problems/${problem_index}`, { method: "GET" }),
            fetch(`/api/contests/${contest_id}/problems/${problem_index}/submissions`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
            })
        ]).then(([res1, res2, res3]) => {
            return Promise.all([res1.json(), res2.json(), res3.json()]);
        }).then(([res1, res2, res3]) => {
            if (res1.success && res2.success) {
                setContest(res1.contest);
                if (res2.problem.editorial) {
                    const editorial = res2.problem.editorial.split("`");
                    res2.problem.editorial = editorial;
                }
                setProblem(res2.problem);
                setLoading(false);
            } else {
                window.location = "/";
            }

            const over = res1.contest.end_time <= Date.now();
            setContestOver(over);

            if (res3.success) {
                setInputs(prevState => ({
                    ...prevState,
                    answer: res3.submission.answer
                }));
                setLocked(true);

            } else if (res3.message !== "Submission does not exist") {
                setParticipating(false);
            }
        });
    }, [params]);

    useEffect(() => {
        if (!loading) {
            MathJax.Hub.Typeset();
        }
    }, [loading]);

    useEffect(() => {
        if (viewEditorial) {
            MathJax.Hub.Typeset();
        }
    }, [viewEditorial]);


    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: false });
        setHelpers({ ...helpers, [event.target.name]: "" });
    }

    const submit = (event) => {
        if (buttonLocked) return;
        setButtonLocked(true);

        const { contest_id, problem_index } = params;
        if (!locked) {
            const answer = inputs.answer.trim();
            if (answer.length === 0 || answer.length > 32) {
                setErrors({ ...errors, answer: true });
                setHelpers({ ...helpers, answer: "Invalid Answer" });
                setButtonLocked(false);
                return;
            }

            const data = { answer };

            fetch(`/api/contests/${contest_id}/problems/${problem_index}/submissions`, {
                method: "POST",
                headers: { "Content-type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("auth_token") },
                body: JSON.stringify(data)
            }).then((response) => {
                return response.json();
            }).then((res) => {
                if (res.success) {
                    setLocked(true);
                }
                setButtonLocked(false);
            });
        } else {
            fetch(`/api/contests/${contest_id}/problems/${problem_index}/submissions`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth_token") }
            }).then((response) => {
                return response.json();
            }).then((res) => {
                if (res.success) {
                    setLocked(false);
                }
                setButtonLocked(false);
            });
        }
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
                    <Helmet>
                        <title>Problem {problem.problem_index} - Math Showdown</title>
                        <meta property="og:title" content={"Problem " + problem.problem_index + " - Math Showdown"} />
                    </Helmet>
                    <Grid item xs={2} />
                    <Grid item xs={6}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h5"><b>Problem {problem.problem_index}</b>: {problem.title}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginTop: "10px" }} />
                                <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                    <Typography whiteSpace="pre-line">{problem.problem_text}</Typography>
                                </Grid>
                                {problem.image_url &&
                                    <Grid item xs={12} sx={{ marginTop: "15px", textAlign: "center" }}>
                                        <img src={problem.image_url} alt="Problem" style={{ maxWidth: "100%" }} />
                                        <Typography variant="body2">Figure 1: Problem image</Typography>
                                    </Grid>
                                }
                                <Grid item xs={12} sx={{ marginTop: "30px", textAlign: "center" }}>
                                    <TextField
                                        value={inputs.answer}
                                        name="answer"
                                        onChange={handleChange}
                                        label="Answer"
                                        type="number"
                                        variant="standard"
                                        disabled={locked || contestOver || !participating}
                                        error={errors.answer}
                                        helperText={helpers.answer}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ marginTop: "10px", textAlign: "center" }}>
                                    <Button
                                        variant="contained"
                                        color={(locked) ? "error" : "primary"}
                                        disabled={contestOver || !participating}
                                        onClick={submit}>
                                        {locked &&
                                            <Fragment>
                                                <LockOpenIcon />&nbsp;Unlock
                                            </Fragment>
                                        }
                                        {!locked &&
                                            <Fragment>
                                                <LockIcon />&nbsp;Lock In
                                            </Fragment>
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                                <Grid item xs={12}>
                                    <Link to={`/contest/${contest.id}`} style={{ textDecoration: "none" }}>
                                        <Typography variant="h6">
                                            {contest.title} (Div. {contest.division})
                                        </Typography>
                                    </Link>
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
                                </Grid>
                            </Grid>
                        </Paper>
                        {contest.graded && problem.tags.length > 0 &&
                            <Paper square sx={{ padding: "12px", marginTop: "10px" }} elevation={3}>
                                <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                                        <Typography variant="h6">Problem Tags</Typography>
                                    </Grid>
                                    <Divider sx={{ width: "100%" }} />
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {problem.tags.map((tag, index) => (
                                                <Chip key={index} label={tag.tag} size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        }
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={6}>
                        {problem.editorial &&
                            <Paper square sx={{ padding: "12px" }} elevation={3}>
                                <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                                        <Typography variant="h5"><b>Editorial</b></Typography>
                                    </Grid>
                                    <Divider sx={{ width: "100%", marginTop: "10px" }} />
                                    {!viewEditorial &&
                                        <Grid item xs={12} sx={{ marginTop: "5px", textAlign: "center" }}>
                                            <Button variant="outlined" onClick={(event) => setViewEditorial(true)}>View Editorial</Button>
                                        </Grid>
                                    }
                                    {viewEditorial && problem.editorial.map((txt, index) => (
                                        <Fragment key={index}>
                                            {index % 2 === 0 &&
                                                <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                                    <Typography whiteSpace="pre-line">{txt}</Typography>
                                                </Grid>
                                            }
                                            {index % 2 === 1 &&
                                                <Grid item xs={12} sx={{ marginTop: "5px", textAlign: "center" }}>
                                                    <img src={txt} alt="Editorial Helper" style={{ maxWidth: "100%" }}></img>
                                                </Grid>
                                            }
                                        </Fragment>
                                    ))}
                                </Grid>
                            </Paper>
                        }
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12} />
                </Grid>
            }
        </div >
    );
}

export default Problem;