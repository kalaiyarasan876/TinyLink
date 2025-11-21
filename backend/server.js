require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./src/config/db");
const linkRoutes = require("./src/routes/linkRoutes");
const controller = require("./src/controllers/linkController");
const path = require("node:path")
const logger = require('./src/helper/logger')
const httpLogger = require('./src/helper/httpLogger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(httpLogger);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));


(async () => {
  try {
    sequelize.authenticate().then(() => {
      console.log("Connected to PostgreSQL");
    });
  } catch (error) {
    throw new Error("Database Connection Failed~")
  }
})()

//ui
app.get("/", (req, res) => res.render("index"));
app.get("/links/list", async (req, res) => {
  const links = await require("./src/services/linkService").getAllLinks();
  res.render("list", { links });
});
app.get("/links/stats/:code", async (req, res) => {
  const data = await require("./src/services/linkService").getLinkStats(req.params.code);
  if (!data) return res.status(404).send("Not Found");
  res.render("stats", { link: data });
});



// Health Check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});



// API Routes
app.use("/api/v1", linkRoutes);

// Redirect Route
app.get("/:code", controller.redirectToTarget);

const server = app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);



process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});



process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
  server.close(() => {process.exit(1)});
  
});