const Users = require("./model");

exports.prevent_duplicate = async (req, res, next) => {
  try {
    const { id = null } = req.params;
    const { email, phone } = req.body;

    const isExists = await Users.count({
      where: {
        [Op.or]: [{ email }, { phone }],
        id: { ...(id ? { [Op.ne]: id } : {}) },
      },
    });

    if (isExists) {
      return res
        .status(400)
        .json({ status: false, message: "Email or Phone already exists" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
