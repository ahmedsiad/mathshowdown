import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const ContestList = (props) => {
    const [loading, setLoading] = useState(true);
    const [contests, setContests] = useState([]);

    useEffect(() => {
        fetch("/api/contests", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                console.log(res);
                setContests(res.contests);
                setLoading(false);
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
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>

                        </Paper>
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default ContestList;