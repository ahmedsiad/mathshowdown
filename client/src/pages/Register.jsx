import { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const isAlphaNumeric = (str) => {
    return !!str.match(/^[0-9a-z]+$/i);
}

const isValidUsername = (username) => {
    return isAlphaNumeric(username) && username.length >= 3 && username.length <= 32;
}

const isValidPassword = (password) => {
    return password.length >= 6 && password.length <= 64;
}

const Register = (props) => {
    const [inputs, setInputs] = useState({ username: "", email: "", password: "", confirm: "" });

    const [errors, setErrors] = useState({ username: false, email: false, password: false, confirm: false });
    const [helpers, setHelpers] = useState({ username: "", email: "", password: "", confirm: "" });

    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: false });
        setHelpers({ ...helpers, [event.target.name]: "" });
    }

    const submit = (event) => {
        let flag = false;
        let { username: ue, email: ee, password: pe, confirm: ce } = errors;
        let { username: uh, email: eh, password: ph, confirm: ch } = helpers;
        if (!isValidUsername(inputs.username)) {
            ue = true
            uh = "Invalid Username";
            flag = true;
        }
        if (inputs.email === "") {
            ee = true;
            eh = "Invalid Email";
            flag = true;
        }
        if (!isValidPassword(inputs.password)) {
            pe = true;
            ph = "Must be atleast 6 characters";
            flag = true;
        }
        if (inputs.password !== inputs.confirm) {
            ce = true;
            ch = "Passwords do not match";
            flag = true;
        }
        setErrors({ ...errors, username: ue, email: ee, password: pe, confirm: ce });
        setHelpers({ ...helpers, username: uh, email: eh, password: ph, confirm: ch });
        if (flag) return;

        const data = { username: inputs.username, email: inputs.email, password: inputs.password };
        fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then((results) => {
            return results.json();
        }).then((data) => {
            if (data.success) {
                localStorage.setItem("auth_token", data.token);
                sessionStorage.setItem("auth_token", data.token);
                window.location = "/";
            } else {
                if (data.message === "Username already exists!") {
                    setErrors({ ...errors, username: true });
                    setHelpers({ ...helpers, username: "Username already exists" });
                } else if (data.message === "Email already exists!") {
                    setErrors({ ...errors, email: true });
                    setHelpers({ ...helpers, email: "Email already exists" });
                }
            }
        });
    }
    return (
        <div>
            <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                <Grid item xs={4} />
                <Grid item xs={4}>
                    <Paper square sx={{ padding: "12px" }} elevation={3}>
                        <Grid container spacing={2} sx={{ width: "100%", margin: 0, textAlign: "center" }}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Register</Typography>
                            </Grid>
                            <Divider sx={{ width: "100%" }} />
                            <Grid item xs={12}>
                                <TextField
                                    value={inputs.username}
                                    name="username"
                                    onChange={handleChange}
                                    label="Username"
                                    variant="standard"
                                    error={errors.username}
                                    helperText={helpers.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={inputs.email}
                                    name="email"
                                    onChange={handleChange}
                                    label="Email"
                                    variant="standard"
                                    error={errors.email}
                                    helperText={helpers.email}
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
                            <Grid item xs={12}>
                                <TextField
                                    value={inputs.confirm}
                                    name="confirm"
                                    onChange={handleChange}
                                    label="Confirm Password"
                                    type="password"
                                    variant="standard"
                                    error={errors.confirm}
                                    helperText={helpers.confirm}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "10px" }}>
                                <Button variant="contained" onClick={submit}>Register</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Register;