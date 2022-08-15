import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TopRated from "../components/TopRated";
import Username from "../components/Username";

const Home = (props) => {
    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={2} />
                <Grid item xs={6}>
                    <Paper square sx={{ padding: "12px" }} elevation={3}>
                        <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <Typography variant="h4">News and Updates</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Introducing Speed Rounds</Typography>
                                <Typography variant="body2">Aug. 15, 2022</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                <Typography>
                                    A new type of rounds called "Speed Rounds" has been created, thanks to&nbsp;
                                    <Username rating={1500} display="inline-flex">floaty</Username>! These rounds are like regular Beta rounds,
                                    but speed will be key. They will have several questions with short problem statements to accomodate the short
                                    round duration. The very first round of these, MS Speed Round #1, will be held on Wednesday August 15, 2022
                                    at 21:00 MST (03:00 UTC). Make sure to register on the&nbsp;
                                    <Link to={"/contests"}>contests</Link>
                                    &nbsp;page before the contest starts. Good luck to all!
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>MS Beta Round #2</Typography>
                                <Typography variant="body2">July 19, 2022</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                <Typography>
                                    I am happy to announce that MS Beta Round #2 (Div. 2) will be held on Saturday July 23, 2022 at 19:00 MST (01:00 UTC).
                                    There will be <b>5</b> problems and <b>45</b> minutes to complete them. Make sure to register on the&nbsp;
                                    <Link to={"/contests"}>contests</Link>
                                    &nbsp;page before the contest starts. I hope you will be able to participate and gain rating!
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>The Beginning</Typography>
                                <Typography variant="body2">July 4, 2022</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid item xs={12} sx={{ marginTop: "5px" }}>
                                <Typography>
                                    Welcome to Math Showdown! There aren't many updates right now but make sure to check out the&nbsp;
                                    <Link to={"/contests"}>contests</Link>
                                    &nbsp;page and register for any upcoming contests. The first contest will likely consist of 5-7 questions
                                    and 30-45 minutes to complete them. It will serve as a test drive for all future contests. Please do participate
                                    if you can, I will try to make it an interesting contest!
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <TopRated />
                </Grid>
                <Grid item xs={12} />
            </Grid>
        </div>
    );
}

export default Home;