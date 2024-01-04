const { User } = require("../model/User");


exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "name email id addresses role").exec();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch data by id" });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json( user );
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
