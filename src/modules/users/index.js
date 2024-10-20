const { getProfile ,Logout } = require("./controller");

const router = require("express").Router();

router.route("/profile").get(getProfile);
router.route("/logout").get(Logout);

module.exports = router;
