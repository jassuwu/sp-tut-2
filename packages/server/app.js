const express = require("express");
const path = require("path");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors({ origin: "http://localhost:3000/" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));


// Health Check
app.get("/", (req, res) => {
  /* res.send("OK"); */
  res.status(200).send("OK");
});

app.use("/api/calendar", require("./routes/Calendar"));
app.use("/api/calendar", require("./routes/Planner"));
app.use("/api/calendar", require("./routes/Activity"));
app.use("/api/template", require("./routes/Template"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    errors: [{ msg: err.message }],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
