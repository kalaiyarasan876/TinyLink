const Link = require("../models/linkModel");
const { generateCode } = require("../utils/codegen");

exports.createShortLink = async ({ target, code }) => {

  if (code) {
    const exists = await Link.findOne({ where: { code, deleted: false } });
    if (exists) return { error: "Code already exists", status: 409 };
  }

  // If no code -> generate one
  if (!code) {
    let retry = 0;
    do {
      code = generateCode(6);
      const exists = await Link.findByPk(code);
      if (!exists) break;
      retry++;
    } while (retry < 5);
  }

  const link = await Link.create({
    code,
    target_url: target,
  });

  return link;
};

exports.getAllLinks = async () => {
  return await Link.findAll({
    where: { deleted: false },
    order: [["created_at", "DESC"]],
  });
};

exports.getLinkStats = async (code) => {
  return await Link.findOne({
    where: { code, deleted: false },
  });
};

exports.deleteLink = async (code) => {
  return await Link.update(
    { deleted: true },
    { where: { code, deleted: false } }
  );
};

exports.handleRedirect = async (code) => {
  const link = await Link.findOne({
    where: { code, deleted: false },
  });

  if (!link) return null;

  // update stats
  link.clicks += 1;
  link.last_clicked = new Date();
  await link.save();

  return link.target_url;
};
