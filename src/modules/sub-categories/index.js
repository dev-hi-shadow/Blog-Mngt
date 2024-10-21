const { JoiValidator } = require("../../middlewares");
const {
  createSubCategoryJoiValidation,
  updateSubCategoryJoiValidation,
} = require("./validation");
const {
  CreateSubCategory,
  updateSubCategory,
  getSubCategories,
  deleteSubCategory,
} = require("./controller");

const router = require("express").Router();

router.route("/").get(getSubCategories);

router.route("/create").post(CreateSubCategory);
router.route("/update/:id").put(updateSubCategory);

router.route("/delete/:id").delete(deleteSubCategory);
module.exports = router;
