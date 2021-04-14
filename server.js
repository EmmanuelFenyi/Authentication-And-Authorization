const express = require("express");

// instantiation
const app = express();
app.use(express.json());

// connect to database
require("./config/dbConnect");

// middleware
app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/usersRouter"));

// port
app.listen(4000, () => console.log("Server up and running"));
