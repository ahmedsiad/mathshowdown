import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

const Countdown = (props) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        updateCountdown();

        const intervalId = setInterval(() => {
            updateCountdown();
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const updateCountdown = () => {
        const seconds = (props.timestamp - Date.now()) / 1000;

        if (seconds < 0) {
            setTimeLeft("00:00:00");
            return;
        }

        let timeStr = new Date(seconds * 1000).toISOString().substring(11, 19);
        const hours = Math.floor(seconds / 3600);
        if (hours >= 24) {
            timeStr = hours.toString() + timeStr.substring(2);
        }
        setTimeLeft(timeStr);
    }


    return (
        <div>
            <Typography variant={props.variant} sx={{ color: "#555555" }}>{timeLeft}</Typography>
        </div>
    );
}

Countdown.defaultProps = {
    variant: "body1"
};

export default Countdown;