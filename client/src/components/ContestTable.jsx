import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const ContestTable = (props) => {
    const submissions = {};
    for (const sub of props.submissions) {
        submissions[sub.problem_id] = sub;
    }
    console.log(submissions);

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>%</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.problems.map((problem, index) => (
                        <TableRow
                            key={index}
                            hover
                            sx={index % 2 ? { background: "white" } : { background: "#f7f7f7" }}>
                            <TableCell component="th" scope="row" align="center" sx={{ width: "10%" }}>
                                <Link to={`${props.path}/problem/` + problem.problem_index} style={{ textDecoration: "none" }}>
                                    <Typography variant="body1">{problem.problem_index}</Typography>
                                </Link>
                            </TableCell>
                            <TableCell sx={{ width: "70%" }}>
                                <Link to={`${props.path}/problem/` + problem.problem_index} style={{ textDecoration: "none" }}>
                                    <Typography variant="body1">{problem.title}</Typography>
                                </Link>
                            </TableCell>
                            <TableCell align="center" sx={{ width: "10%" }}>
                                {submissions[problem.id] && submissions[problem.id].verdict === null &&
                                    <LockIcon />
                                }
                                {submissions.hasOwnProperty(problem.id) && submissions[problem.id].verdict === true &&
                                    <CheckIcon style={{ fill: "green" }} />
                                }
                                {submissions.hasOwnProperty(problem.id) && submissions[problem.id].verdict === false &&
                                    <ClearIcon style={{ fill: "red" }} />
                                }
                                {props.participating && !submissions.hasOwnProperty(problem.id) && !props.contestGraded &&
                                    <LockOpenIcon />
                                }
                            </TableCell>
                            <TableCell align="center" sx={{ width: "10%" }}>

                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default ContestTable;