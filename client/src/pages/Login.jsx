import { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = (props) => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({ username: false, password: false });
    const [helpers, setHelpers] = useState({ username: "", password: "" });

    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: false });
        setHelpers({ ...helpers, [event.target.name]: "" });
    }

    const submit = (event) => {
        const data = { username: inputs.username, email: inputs.username, password: inputs.password };
        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.success) {
                localStorage.setItem("auth_token", data.token);
                sessionStorage.setItem("auth_token", data.token);
                window.location = "/";
            } else {
                setErrors({ ...errors, password: true });
                setHelpers({ ...errors, password: "Incorrect credentials" });
            }
        })
    }


    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Paper square sx={{ padding: "12px" }} elevation={3}>
                        <Grid container spacing={2} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Login</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid item xs={12}>
                                <TextField
                                    value={inputs.username}
                                    name="username"
                                    onChange={handleChange}
                                    label="Username/Email"
                                    variant="standard"
                                    error={errors.username}
                                    helperText={helpers.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={inputs.password}
                                    name="password"
                                    onChange={handleChange}
                                    label="Password"
                                    type="password"
                                    variant="standard"
                                    error={errors.password}
                                    helperText={helpers.password}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "10px" }}>
                                <Button variant="contained" onClick={submit}>Login</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Login;