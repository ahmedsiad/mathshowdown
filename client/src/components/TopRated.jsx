import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import format from "date-fns/format";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import RatingText from "../components/RatingText";
import Username from "../components/Username";


const TopRated = (props) => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/api/users?limit=10", {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                let [curr_rank, last] = [1, 0];
                for (let i = 0; i < res.users.length; i++) {
                    if (i > 0 && res.users[i].rating !== res.users[i - 1].rating) {
                        curr_rank += i - last;
                        last = i;
                    }
                    res.users[i].rank = curr_rank;
                }
                setUsers(res.users);
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
                <Paper square sx={{ padding: "12px" }} elevation={3}>
                    <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography variant="h6">Top Rated</Typography>
                        </Grid>
                        <Divider sx={{ width: "100%" }} />

                        <Grid item xs={12}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Name</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Rating</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, index) => (
                                        <TableRow key={index}
                                            hover
                                            sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                                            <TableCell component="th" scope="row" align="center" sx={{ width: "5%" }}>
                                                {user.rank}
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: "50%" }}>
                                                <Username rating={user.rating}>{user.username}</Username>
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: "5%" }}>
                                                <RatingText rating={user.rating}>{user.rating}</RatingText>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </div>
    );
}

export default TopRated;