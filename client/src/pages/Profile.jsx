import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Helmet } from "react-helmet";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import TopRated from "../components/TopRated";
import RatingText from "../components/RatingText";
import RatingChart from "../components/RatingChart";
import getRank from "../utils/Ranks";

const Profile = (props) => {
    const params = useParams();

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const [maxRating, setMaxRating] = useState(0);

    useEffect(() => {
        const { username } = params;

        fetch(`/api/users/profile/${username}`, {
            method: "GET"
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.success) {
                setUser(res.user);
                setLoading(false);

                let maxRatingBefore = Math.max(...res.user.contest_history.map((p) => p.rating_before));
                let maxRatingAfter = Math.max(...res.user.contest_history.map((p) => p.rating_after));

                setMaxRating(Math.max(maxRatingBefore, maxRatingAfter, res.user.rating));
            } else {
                window.location = "/";
            }
        })
    }, [params]);

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
                        <title>{user.username} - Math Showdown</title>
                        <meta property="og:title" content={user.username + " - Math Showdown"} />
                    </Helmet>
                    <Grid item xs={2} />
                    <Grid item xs={6}>
                        <Paper square sx={{ padding: "12px" }} elevation={3}>
                            <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography variant="h5">
                                        <RatingText rating={user.rating}>
                                            {`${getRank(user.rating)} ${user.username}`}
                                        </RatingText>
                                    </Typography>
                                </Grid>
                                <Divider sx={{ width: "100%" }} />

                                <Grid item xs={12}>
                                    <Typography>
                                        Current Rating: <RatingText rating={user.rating}>{user.rating}</RatingText>
                                        &nbsp;(max.&nbsp;
                                        <RatingText rating={maxRating}>{getRank(maxRating)}, {maxRating}</RatingText>)
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link to={`${window.location.pathname}/contests`}>
                                        <Typography>Contest History</Typography>
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Registered: {formatDistance(user.registration_date, Date.now(), { addSuffix: true })}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <RatingChart user={user} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={3}>
                        <TopRated />
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default Profile;