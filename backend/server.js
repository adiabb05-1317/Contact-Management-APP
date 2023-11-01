const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./db");
const dotenv = require("dotenv");
dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/contacts", require("./Routes/contacts"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));