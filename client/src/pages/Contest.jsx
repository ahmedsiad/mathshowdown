import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const Contest = (props) => {
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState({});

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
                <Grid>

                </Grid>
            }
        </div>
    );
}

export default Contest;