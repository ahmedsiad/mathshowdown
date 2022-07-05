import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Countdown = (props) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [open, setOpen] = useState(false);

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
            if (Math.abs(seconds) < 1 && !open) {
                setOpen(true);
            }
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

    const reload = (props) => {
        window.location.reload();
    }


    return (
        <div>
            <Typography variant={props.variant} sx={{ color: "#555555" }}>{timeLeft}</Typography>
            <Dialog open={open} onClose={reload}>
                <DialogTitle>Countdown</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Looks like the countdown has finished! Reload to see changes.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={reload}>Reload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

Countdown.defaultProps = {
    variant: "body1"
};

export default Countdown;