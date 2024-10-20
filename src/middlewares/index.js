const JWT = require("jsonwebtoken");
const { Users, Roles } = require("../models");
const userAttributes = require("../modules/users/attributes");
const rolesAttributes = require("../modules/roles/attributes");

// Middleware for HTTP requests
exports.verifyAuthToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Please enter a token",
      });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }
    const user = await Users.findByPk(decoded.id, {
      // attributes: userAttributes.auth,
      include: {
        model: Roles,
        as: "role",
        attributes: rolesAttributes.default,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Unauthorized! , Access Denied",
      });
    }
    req.user = user;
    req.user_id = user.id;
    req.isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(user.role.name);
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      error: error.message,
      message: "Your session has been expired  , Please login again ",
    });
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles?.includes(req.user?.role?.name)) {
      return res.status(400).json({
        status: false,
        message: "Access denide.",
      });
    }
    next();
  };

exports.JoiValidator = (schema) => (req, res, next) => {
  try {
    const result = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    });
    if (result?.error?.details?.length) {
      // deleteFile(req?.file);
      return res.status(422).json({
        status: false,
        message: "Invalid data.",
        errors: result?.error?.details?.map((obj) => ({
          key:
            typeof obj?.context?.key !== "string"
              ? obj?.path[0]
              : obj?.context?.key,
          message: obj?.message,
          ...(typeof obj?.context?.key !== "string"
            ? {
                index: obj?.context?.key,
              }
            : {}),
        })),
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
