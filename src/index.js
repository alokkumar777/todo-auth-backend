require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json()); // for JSON body
app.use(require("cors")());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));
app.use("/categories", require("./routes/categories"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
