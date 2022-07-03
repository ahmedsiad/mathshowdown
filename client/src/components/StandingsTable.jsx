import { Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Username from "../components/Username";
import RatingText from "../components/RatingText";
import getRank from "../utils/Ranks";
import formatMinutes from "../utils/FormatTime";

const StandingsTable = (props) => {
    return (
        <div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Who</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Solved</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Penalty</TableCell>
                        {props.problems.map((problem, index) => (
                            <TableCell key={problem.id} align="center" sx={{ fontWeight: "bold" }}>
                                <Link to={`/contest/${props.contest.id}/problem/${problem.problem_index}`}>
                                    {problem.problem_index}
                                </Link>
                            </TableCell>
                        ))}
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Δ</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Rating</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.participants.map((participant, index) => (
                        <TableRow
                            key={participant.id}
                            hover
                            sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                            <TableCell component="th" scope="row" align="center" sx={{ width: "5%" }}>
                                {participant.rank}
                            </TableCell>
                            <TableCell>
                                <Username rating={participant.rating_before}>{participant.username}</Username>
                            </TableCell>
                            <TableCell align="center" sx={{ width: "5%", fontWeight: "bold" }}>
                                {participant.solved}
                            </TableCell>
                            <TableCell align="center" sx={{ width: "5%", fontWeight: "bold" }}>
                                {participant.penalty}
                            </TableCell>
                            {participant.submissions.map((submission, index) => (
                                <TableCell key={index} align="center" sx={{ width: "5%" }}>
                                    {submission && submission.verdict &&
                                        <Fragment>
                                            <CheckIcon sx={{ color: "green" }} /> <br></br>
                                            {formatMinutes(submission.submission_time - props.contest.start_time)}
                                        </Fragment>
                                    }
                                    {submission && !submission.verdict &&
                                        <Typography sx={{ display: "inline-flex", verticalAlign: "middle" }}>
                                            <ClearIcon sx={{ color: "red" }} />
                                        </Typography>

                                    }
                                </TableCell>
                            ))}
                            <TableCell align="center" sx={{ width: "5%" }}>
                                {participant.rating_after - participant.rating_before >= 0 &&
                                    <Typography sx={{ color: "green", fontWeight: "bold" }}>
                                        +{participant.rating_after - participant.rating_before}
                                    </Typography>
                                }
                                {participant.rating_after - participant.rating_before < 0 &&
                                    <Typography sx={{ color: "gray", fontWeight: "bold" }}>
                                        {participant.rating_after - participant.rating_before}
                                    </Typography>
                                }
                            </TableCell>
                            <TableCell align="center" sx={{ width: "10%" }}>
                                <Typography>
                                    <RatingText rating={participant.rating_before}>{participant.rating_before}</RatingText>
                                    &nbsp;→&nbsp;
                                    <RatingText rating={participant.rating_after}>{participant.rating_after}</RatingText>
                                </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: "15%" }}>
                                {getRank(participant.rating_before) !== getRank(participant.rating_after) &&
                                    <Typography>Became&nbsp;
                                        <RatingText rating={participant.rating_after}>
                                            {getRank(participant.rating_after)}
                                        </RatingText>
                                    </Typography>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default StandingsTable;