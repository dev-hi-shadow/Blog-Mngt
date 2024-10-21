const { addBlog, getBlogs, updateBlog, deleteBlog } = require("./controller");

const router = require("express").Router();

router.route("/create").post(addBlog);
router.route("/").get(getBlogs);
router.route("/:id").get(getBlogs);
router.route("/update/:id").put(updateBlog);
router.route("/delete/:id").delete(deleteBlog);

module.exports = router;
