import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import getRank from "../utils/Ranks";
import Colors from "../utils/Colors";



const Username = (props) => {
    const user_rank = getRank(props.user.rating);
    const user_color = Colors[user_rank];

    return (
        <div>
            <Link to={`/profile/${props.user.username}`} title={`${user_rank} ${props.user.username}`}>
                <Typography sx={{ color: user_color, fontWeight: "bold" }}>{props.user.username}</Typography>
            </Link>
        </div>
    );
}

export default Username;