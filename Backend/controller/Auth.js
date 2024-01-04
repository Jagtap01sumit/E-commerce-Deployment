const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
exports.createUser = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const savedUser = await user.save();
        req.login(sanitizeUser(savedUser), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(201).json(sanitizeUser(savedUser));
          }
        });
       
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create the User" });
  }
};

exports.loginUser = async (req, res) => {
  res.json(req.user);
};
exports.checkUser = async (req, res) => {
  res.json(req.user);
};
