const { addComment, updateComment, deleteComment } = require("./controller");

const router = require("express").Router();

router.route("/").post(addComment);
router.route("/:id").put(updateComment);
router.route("/:id").delete(deleteComment);

module.exports = router;
