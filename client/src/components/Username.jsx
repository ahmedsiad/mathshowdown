import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import RatingText from "./RatingText";
import getRank from "../utils/Ranks";
import Colors from "../utils/Colors";


const Username = (props) => {
    const user_rank = getRank(props.rating);
    const user_color = Colors[user_rank];

    return (
        <div>
            <Link to={`/profile/${props.children}`} title={`${user_rank} ${props.children}`}>
                <Typography sx={{ color: user_color, fontWeight: "bold" }}>
                    <RatingText rating={props.rating}>{props.children}</RatingText>
                </Typography>
            </Link>
        </div>
    );
}

export default Username;