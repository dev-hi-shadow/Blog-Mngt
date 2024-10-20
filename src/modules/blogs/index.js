const { addBlog, getBlogs, updateBlog, deleteBlog } = require("./controller");

const router = require("express").Router();

router.route("/").post(addBlog);
router.route("/").get(getBlogs);
router.route("/:id").get(getBlogs);
router.route("/:id").put(updateBlog);
router.route("/:id").delete(deleteBlog);

module.exports = router;
