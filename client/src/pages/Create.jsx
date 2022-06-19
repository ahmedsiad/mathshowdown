import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ContestTable from "../components/ContestTable";

const Create = (props) => {
    const [value, setValue] = useState(new Date());

    const onChange = (newVal) => {
        setValue(newVal);
        console.log(newVal);
    }

    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={2} />
                <Grid item xs={6}>
                    <Paper square sx={{ padding: "12px" }} elevation={3}>
                        <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <Typography variant="h4">Contest Creator</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />

                            <Grid item xs={2}>
                                <Typography variant="h6">Contest Title:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField size="small" sx={{ width: "100%" }}></TextField>
                            </Grid>
                            <Grid item xs={4} />

                            <Grid item xs={2}>
                                <Typography variant="h6">Start Time:</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker value={value} onChange={onChange} renderInput={(params) => <TextField {...params} size="small" />} />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Create;