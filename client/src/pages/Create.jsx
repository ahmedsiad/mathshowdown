import { useState, useEffect, Fragment } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";

// make selects scrollable
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        },
    },
};

const Create = (props) => {
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);

    const [contestInputs, setContestInputs] = useState({ title: "", division: 1, authors: [] });
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(startTime.getTime() + 7200 * 1000));
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(false);

    const [buttonLocked, setButtonLocked] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/users", { method: "GET" }),
            fetch("/api/tags", { method: "GET" })
        ]).then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()]);
        }).then(([res1, res2]) => {
            if (res1.success && res2.success) {
                setUsers(res1.users);

                res2.tags.sort((a, b) => a.tag.localeCompare(b.tag));
                setTags(res2.tags);
            }
        });
    }, []);

    const handleStartTime = (newVal) => {
        setStartTime(newVal);
    }

    const handleEndTime = (newVal) => {
        setEndTime(newVal);
    }

    const handleContestInputs = (event) => {
        setContestInputs({ ...contestInputs, [event.target.name]: event.target.value });
    }

    const handleProblem = (event, index) => {
        setProblems([
            ...problems.slice(0, index),
            { ...problems[index], [event.target.name]: event.target.value },
            ...problems.slice(index + 1)
        ]);
    }

    const addProblem = (event) => {
        if (problems.length >= 26) return;
        setProblems([...problems, { title: "", description: "", image: "", answer: "", tags: [] }]);
    }

    const deleteProblem = (event, index) => {
        setProblems([
            ...problems.slice(0, index),
            ...problems.slice(index + 1)
        ]);
    }

    const closeError = (event) => {
        setError(false);
    }

    const submit = (event) => {
        if (buttonLocked) return;
        setButtonLocked(true);

        if (contestInputs.title === "" || contestInputs.authors.length === 0 || problems.length === 0) {
            setError(true);
            setButtonLocked(false);
            return;
        }
        for (const prob of problems) {
            if (prob.title === "" || prob.description === "" || prob.answer === "") {
                setError(true);
                setButtonLocked(false);
                return;
            }
        }

        let author_ids = [];
        for (const author of contestInputs.authors) {
            let user = users.filter((u) => u.username === author)[0];
            author_ids.push(user.id);
        }

        const data = { ...contestInputs, authors: author_ids, startTime: startTime.setSeconds(0), endTime: endTime.setSeconds(0), problems };

        fetch("/api/contests", {
            method: "POST",
            headers: { "Content-type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("auth_token") },
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                window.location = "/contests";
            } else {
                setError(true);
            }
            setButtonLocked(false);
        });
    }

    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={2} />
                <Grid item xs={7}>
                    <Paper square sx={{ padding: "12px" }} elevation={3}>
                        <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <Typography variant="h4">Contest Creator</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%", marginTop: "15px" }} />

                            <Grid item xs={2}>
                                <Typography variant="h6">Contest Title:</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    value={contestInputs.title}
                                    onChange={handleContestInputs}
                                    size="small"
                                    sx={{ width: "100%" }}></TextField>
                            </Grid>
                            <Grid item xs={5} />

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={2}>
                                    <Typography variant="h6">Start Time:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <DateTimePicker
                                        value={startTime}
                                        minDateTime={new Date()}
                                        onChange={handleStartTime}
                                        renderInput={(params) => <TextField {...params} size="small" />} />
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h6">End Time:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <DateTimePicker
                                        value={endTime}
                                        minDateTime={startTime}
                                        onChange={handleEndTime}
                                        renderInput={(params) => <TextField {...params} size="small" />} />
                                </Grid>
                            </LocalizationProvider>

                            <Grid item xs={2}>
                                <Typography variant="h6">Division:</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel>Division</InputLabel>
                                    <Select label="Division" name="division" size="small" value={contestInputs.division} onChange={handleContestInputs}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} />

                            <Grid item xs={2}>
                                <Typography variant="h6">Authors:</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
                                    <InputLabel>Authors</InputLabel>
                                    <Select
                                        multiple
                                        name="authors"
                                        value={contestInputs.authors}
                                        onChange={handleContestInputs}
                                        input={<OutlinedInput label="Authors" />}
                                        MenuProps={MenuProps}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selected.map((author) => (
                                                    <Chip key={author} label={author} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.username} value={user.username}>
                                                <Checkbox checked={contestInputs.authors.indexOf(user.username) > -1} />
                                                <ListItemText primary={user.username} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5} />

                            {problems.map((problem, index) => (
                                <Fragment key={index}>
                                    <Grid item xs={12} />
                                    <Grid item xs={1} />
                                    <Grid item xs={10} sx={{ textAlign: "center" }}>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", display: "inline" }}>Problem {String.fromCharCode(65 + index)}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={(event) => deleteProblem(event, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                    <Divider sx={{ width: "100%", marginTop: "10px" }} />

                                    <Grid item xs={2}>
                                        <Typography variant="h6">Problem Title:</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            name="title"
                                            label="Title"
                                            value={problem.title}
                                            onChange={(event) => handleProblem(event, index)}
                                            size="small"
                                            sx={{ width: "100%" }} />
                                    </Grid>
                                    <Grid item xs={5} />

                                    <Grid item xs={2}>
                                        <Typography variant="h6">Description:</Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField
                                            multiline
                                            minRows={5}
                                            maxRows={10}
                                            size="small"
                                            name="description"
                                            label="Description"
                                            value={problem.description}
                                            onChange={(event) => handleProblem(event, index)}
                                            sx={{ width: "100%" }} />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <Typography variant="h6">Tags:</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
                                            <InputLabel>Tags</InputLabel>
                                            <Select
                                                multiple
                                                name="tags"
                                                value={problem.tags}
                                                onChange={(event) => handleProblem(event, index)}
                                                input={<OutlinedInput label="Tags" />}
                                                MenuProps={MenuProps}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {selected.map((id) => (
                                                            <Chip key={id} label={tags.find((tg) => tg.id === id).tag} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {tags.map((tag) => (
                                                    <MenuItem key={tag.tag} value={tag.id}>
                                                        <Checkbox checked={problem.tags.indexOf(tag.id) > -1} />
                                                        <ListItemText primary={tag.tag} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={5} />

                                    <Grid item xs={2}>
                                        <Typography variant="h6">Image URL:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            name="image"
                                            label="Image"
                                            value={problem.image}
                                            size="small"
                                            onChange={(event) => handleProblem(event, index)}
                                            sx={{ width: "100%" }} />
                                    </Grid>
                                    <Grid item xs={6} />

                                    <Grid item xs={2}>
                                        <Typography variant="h6">Answer:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            name="answer"
                                            label="Answer"
                                            value={problem.answer}
                                            size="small"
                                            onChange={(event) => handleProblem(event, index)}
                                            sx={{ width: "100%" }} />
                                    </Grid>
                                    <Grid item xs={6} />
                                </Fragment>
                            ))}
                            <Grid item xs={2} sx={{ marginTop: "20px" }}>
                                <IconButton size="large" onClick={addProblem}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={10} />

                            <Grid item xs={12} sx={{ textAlign: "center", marginTop: "30px" }}>
                                <Button variant="contained" onClick={submit} color={error ? "error" : "primary"}>
                                    Create Contest
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={5000} onClose={closeError} message={"Invalid Submission"}></Snackbar>
        </div>
    );
}

export default Create;