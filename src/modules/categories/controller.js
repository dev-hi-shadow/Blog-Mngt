const { Categories } = require("../../models");
const { Op } = require("sequelize");
const categoryAttr = require("./attributes");
const { getFileNameFromFileObject } = require("../../helpers");

exports.CreateCategory = async (req, res, next) => {
  try {
    const category = await Categories.create({
      ...req.body,
      updated_by: req.user_id,
      created_by: req.user_id,
    });
    res.status(201).json({
      status: 201,
      success: true,
      message: "Category Created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Categories.findAndCountAll({
      attributes: categoryAttr.default,
      limit: 1,
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Categories fetched",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Categories.update(
      { ...req.body, updated_by: req.user_id },
      { where: { id } }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Category Updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Categories.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Category Deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
