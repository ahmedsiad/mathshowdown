const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

// ROUTES

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/contests", require("./routes/contest"));
app.use("/api/problems", require("./routes/problem"));
app.use("/api/tags", require("./routes/tags"));

app.listen(PORT, () => {
    console.log(`Port has started on port ${PORT}`);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// set pg type

const types = require("pg").types;
types.setTypeParser(20, (val) => parseInt(val, 10));