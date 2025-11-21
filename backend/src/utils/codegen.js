const crypto = require("crypto");
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

exports.generateCode = (length = 6) => {
  let output = "";
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    output += CHARS[bytes[i] % CHARS.length];
  }

  return output;
};
