require("dotenv").config({path:'./config/.env.local'});

const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require('morgan');

console.log(process.env.STORAGE_PROVIDER);

const uploadRoutes = require("./routes/upload.routes");

const connectDB = require("./config/db");
const submissionRoutes = require("./routes/submissionRoutes");

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization",  "filelabel"],
  })
);
app.options(/.*/, cors());

app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "API is running" });
});

app.use("/api/submissions", submissionRoutes);

// Only needed for LOCAL provider (harmless even if you use Appwrite sometimes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));