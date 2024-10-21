const {
  addComment,
  updateComment,
  deleteComment,
  getComments,
} = require("./controller");

const router = require("express").Router();

router.route("/create").post(addComment);
router.route("/").post(getComments);
router.route("/update/:id").put(updateComment);
router.route("/delete/:id").delete(deleteComment);

module.exports = router;
