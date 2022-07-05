import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TopRated from "../components/TopRated";

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
            </Grid>
        </div>
    );
}

export default Home;