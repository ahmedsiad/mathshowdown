import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import RatingText from "./RatingText";
import getRank from "../utils/Ranks";
import Colors from "../utils/Colors";


const Username = (props) => {
    const user_rank = getRank(props.rating);
    const user_color = Colors[user_rank];

    return (
        <Link to={`/profile/${props.children}`} title={`${user_rank} ${props.children}`} style={{ display: (props.display) ? props.display : "inline" }}>
            <Typography sx={{ color: user_color, fontWeight: "bold" }} variant={(props.variant) ? props.variant : "body1"}>
                <RatingText rating={props.rating}>{props.children}</RatingText>
            </Typography>
        </Link>
    );
}

export default Username;