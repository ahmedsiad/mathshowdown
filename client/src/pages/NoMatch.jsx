import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const NoMatch = (props) => {
    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={2} />
                <Grid item xs={8} sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>Oops...</Typography>
                    <Typography variant="h6" sx={{ marginTop: "20px" }}>Looks like this page doesn't exist.</Typography>
                    <Link to={"/"}>
                        <Typography sx={{ marginTop: "10px" }}>Click here to go back to the home page.</Typography>
                    </Link>
                </Grid>
                <Grid item xs={2} />
            </Grid>
        </div>
    );
}

export default NoMatch;