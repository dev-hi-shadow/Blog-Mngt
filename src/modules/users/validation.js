const Joi = require("joi");

module.exports = {
  RegisterJoiSchema: Joi.object().keys({
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().optional().label("Last Name"),
    phone: Joi.number().required().label("phone"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
  }),

  loginJoiSchema: Joi.object().keys({
    credential: Joi.string().label("credential"),
    password: Joi.string().min(8).required().label("password"),
  }),

  updateUserJoiSchema: Joi.object().keys({
    name: Joi.string().label("Name"),
    email: Joi.string().email().label("email"),
    phone: Joi.string().label("phone"),
    role_id: Joi.number().label("role_id"),
    username: Joi.string().label("username"),
  }),
};
