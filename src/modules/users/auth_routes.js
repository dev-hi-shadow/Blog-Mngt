const { JoiValidator } = require("../../middlewares");
const { login, Register } = require("./controller");
const { prevent_duplicate } = require("./helper");
const { RegisterJoiSchema, loginJoiSchema } = require("./validation");

const router = require("express").Router();

router
  .route("/signup")
  .post(JoiValidator(RegisterJoiSchema), prevent_duplicate, Register);
router.route("/signin").post(JoiValidator(loginJoiSchema), login);
module.exports = router;
