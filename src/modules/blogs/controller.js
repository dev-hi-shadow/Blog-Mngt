const { getTableFilters } = require("../../helpers");
const {
  Blogs,
  SubCategories,
  Users,
  Categories,
  BlgComments,
} = require("../../models");
const moment = require("moment");

exports.addBlog = async (req, res, next) => {
  try {
    const category = (
      await SubCategories.findByPk(req.body.sub_category_id)
    ).toJSON();
    const blog = await Blogs.create({
      ...req.body,
      category_id: category.category_id,
      author_id: req.user_id,
      created_by: req.user_id,
      updated_by: req.user_id,
      published_at: moment(),
    });
    res.status(201).json({ status: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog = null,
      blogs = null;

    const query = {
      ...getTableFilters(req),
      include: [
        {
          model: Categories,
          as: "category",
        },
        {
          model: Users,
          as: "created_by_user",
        },
        {
          model: SubCategories,
          as: "sub_category",
        },
        {
          model: SubCategories,
          as: "sub_category",
        },
        {
          model: BlgComments,
          as: "comments",
          include: [
            {
              model: Users,
              as: "created_by_user",
            },
          ],
        },
      ],
    };

    if (id) {
      blog = await Blogs.findByPk(id, query);
    } else {
      blogs = await Blogs.findAndCountAll({
        ...query,
        ...getTableFilters(req),
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "blogs fetched successfully",
      data: {
        ...(blog ? { blog } : { blogs }),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blogs.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Blog not found",
      });
    }
    await Blogs.update(
      { ...req.body, updated_by: req.user_id },
      { where: { id } }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blogs.count(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Blog not found",
      });
    }
    await Blogs.destroy({
      where: { id },
      individualHooks: true,
      deleted_by: req.user_id,
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
