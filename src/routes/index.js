const { verifyAuthToken } = require("../middlewares");

const router = require("express").Router();

router.use("/auth", require("../modules/users/auth_routes"));

router.use(verifyAuthToken);

router.use("/users", require("../modules/users"));
router.use("/blogs", require("../modules/blogs"));
router.use("/categories", require("../modules/categories"));
router.use("/sub-categories", require("../modules/sub-categories"));
 
module.exports = router;
