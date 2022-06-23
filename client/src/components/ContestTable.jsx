import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const ContestTable = (props) => {
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
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
                            <TableCell>
                                <Link to={`${props.path}/problem/` + problem.problem_index} style={{ textDecoration: "none" }}>
                                    <Typography variant="body1">{problem.title}</Typography>
                                </Link>
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