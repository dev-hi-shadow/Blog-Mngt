const { getProfile, Logout, list } = require("./controller");

const router = require("express").Router();

router.route("/").get(list);
router.route("/profile").get(getProfile);
router.route("/logout").get(Logout);

module.exports = router;
