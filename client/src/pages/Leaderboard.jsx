import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import TopRated from "../components/TopRated";
import RatingText from "../components/RatingText";
import Username from "../components/Username";

const Leaderboard = (props) => {
    const [searchParams,] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(10);

    useEffect(() => {
        let page = searchParams.get("page");
        page = (page) ? parseInt(page) : 0;
        setCurrentPage(page + 1);

        fetch(`/api/users?page=${page}`, {
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
                setMaxPage(Math.floor(res.count / 100) + 1);
                setLoading(false);
            } else {
                window.location = "/";
            }
        });

    }, [searchParams]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <div>
            <Helmet>
                <title>Leaderboard - Math Showdown</title>
                <meta property="og:title" content="Leaderboard - Math Showdown" />
            </Helmet>
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
                                    <Typography variant="h5">Leaderboard</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />

                                <Grid item xs={12}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                                                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>Registered</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: "bold" }}>=</TableCell>
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
                                                    <TableCell sx={{ width: "50%" }}>
                                                        <Username rating={user.rating}>{user.username}</Username>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10%" }}>
                                                        {format(user.registration_date, "MMM/dd/yyyy")}
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
                        <Pagination
                            page={currentPage}
                            showFirstButton
                            showLastButton
                            count={maxPage}
                            onChange={handleChange}
                            sx={{ marginTop: "10px" }}
                            renderItem={(item) => (
                                <PaginationItem component={Link} to={`/leaderboard${(item.page === 1 ? "" : `?page=${item.page - 1}`)}`} {...item} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TopRated />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={12} />
                </Grid>
            }
        </div>
    );
}

export default Leaderboard;