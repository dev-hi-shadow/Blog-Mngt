const { Users, SMSHISTORY, Addresses } = require("../../models");
const JWT = require("jsonwebtoken");
const { Op } = require("sequelize");
const md5 = require("md5");
const RoleAttributes = require("../roles/attributes");
const Roles = require("../roles/model");
  const { getFileNameFromFileObject } = require("../../helpers");

const Register = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Please upload a profile picture",
      });
    }
    const profile_picture = getFileNameFromFileObject(req.file);
    const { address, city, state, country, postal_code, is_primary, ...rest } =
      req.body;
    const Role = await Roles.findOne({
      where: {
        name: "CUSTOMER",
      },
    });
    let user = await Users.create({
      ...rest,
      profile_picture,
      created_by: req.user_id,
      updated_by: req.user_id,
      role_id: Role.id,
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong! Please try after sometime.",
      });
    }
    let new_address = await Addresses.create({
      address,
      city,
      state,
      country,
      postal_code,
      is_primary,
      created_by: req.user_id || user.id,
      updated_by: req.user_id || user.id,
      user_id: user.id,
    });

    let role = await Roles.findByPk(user.role_id, {
      attributes: RoleAttributes.default,
    });

    // if (!role || role.toJSON().name === "SELLER") {
    //   asyncEmailQueue
    //     .createJob({
    //       type: "NEW_SELLER_REGISTERED",
    //       data: user,
    //     })
    //     .retries(3)
    //     .save();
    // asyncSMSQueue
    //   .createJob({
    //     type: "NEW_SELLER_REGISTERED",
    //     data: user,
    //   })
    //   .retries(3)
    //   .save();
    // }
    user = user.toJSON();
    new_address = new_address.toJSON();
    user.token = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Signup successfully",
      data: {
        // ...user,
        // ...new_address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  console.log("helllo");
  try {
    const { credential, password } = req.body;
    let user = await Users.findOne({
      where: {
        [Op.or]: [
          {
            email: credential,
          },
          {
            phone: credential,
          },
        ],
      },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email ",
      });
    }
    const isMatch = md5(password) === user.getDataValue("password");
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password",
      });
    }
    let token = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      status: 200,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await Users.findByPk(req.user_id);
    if (!profile || !profile.toJSON()) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong! Please try after sometime.",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Profile fetched",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const Logout = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Something went wrong!",
        logout: true,
      });
    }
    req.user = null;
    req.user_id = null;
    req.isAdmin = null;

    res.status(200).json({
      status: 200,
      message: "Logout Successfull",
      logout: true,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  Register,
  getProfile,
  login,
  Logout,
};
