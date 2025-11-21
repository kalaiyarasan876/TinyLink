const express = require("express");
const router = express.Router();
const controller = require("../controllers/linkController");

router.post("/", controller.createLink);
router.get("/", controller.listLinks);
router.get("/:code", controller.linkStats);
router.delete("/:code", controller.deleteLink);

module.exports = router;
