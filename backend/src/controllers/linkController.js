const linkService = require("../services/linkService");

// POST /api/v1
exports.createLink = async (req, res) => {
  try {
    const { target, code } = req.body;

    if (!target)
      return res.status(400).json({ error: "Target URL required" });

    const result = await linkService.createShortLink({ target, code });

    if (result.error)
      return res.status(result.status).json({ error: result.error });

    return res.status(201).json(result);
  } catch (err) {
    console.error("Create link error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/v1
exports.listLinks = async (req, res) => {
  const links = await linkService.getAllLinks();
  res.json(links);
};

// GET /api/v1/:code
exports.linkStats = async (req, res) => {
  const link = await linkService.getLinkStats(req.params.code);
  if (!link) return res.status(404).json({ error: "Not found" });
  res.json(link);
};

// DELETE /api/v1/:code
exports.deleteLink = async (req, res) => {
  const deleted = await linkService.deleteLink(req.params.code);
  if (deleted[0] === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
};

// GET /:code
exports.redirectToTarget = async (req, res) => {
  const target = await linkService.handleRedirect(req.params.code);
  if (!target) return res.status(404).send("Not Found");
  return res.redirect(302, target);
};
