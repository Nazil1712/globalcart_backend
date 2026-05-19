const { User } = require("../model/User");

exports.updateUserAPI = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    // console.log("Response ", user);
    res.status(200).json({
      email: user.email,
      role: user.role,
      addresses: user.addresses,
      id: user.id,
      name: user?.name,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchLoggedInUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      email: user.email,
      role: user.role,
      addresses: user.addresses,
      id: user.id,
      name: user?.name,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
