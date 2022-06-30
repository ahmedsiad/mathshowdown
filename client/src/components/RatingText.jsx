import Box from "@mui/material/Box";
import getRank from "../utils/Ranks";
import Colors from "../utils/Colors";

const RatingText = (props) => {
    const rank = getRank(props.rating);
    const color = Colors[rank];

    return (
        <Box component="span" sx={{ color: color, fontWeight: "bold" }}>{props.children}</Box>
    );
}

export default RatingText;