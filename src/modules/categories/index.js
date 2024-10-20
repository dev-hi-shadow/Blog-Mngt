const { JoiValidator } = require("../../middlewares");
const upload = require("../../middlewares/multer");
const {
  createCategoryJoiValidation,
  updateCategoryJoiValidation,
} = require("../categories/validation");
const {
  CreateCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("./controller");

const router = require("express").Router();

router.route("/").get(getCategories);
router.route("/create").post(CreateCategory);

router.route("/update/:id").put(updateCategory);

router.route("/delete/:id").delete(deleteCategory);

module.exports = router;
