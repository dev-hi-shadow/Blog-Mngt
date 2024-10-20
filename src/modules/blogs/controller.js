const { getTableFilters } = require("../../helpers");
const { Blogs, SubCategories } = require("../../models");

exports.addBlog = async (req, res, next) => {
  try {
    const blog = await Blogs.create({
      ...req.body,
      created_by: req.user_id,
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
      include: [
        {
          model: Categories,
          as: "category",
          // attributes: ['id', 'name']
        },
        {
          model: Users,
          as: "created_by_user",
          // attributes: ['id', 'fisrt_name' , "last_name" , "display_name"]
        },
        {
          model: SubCategories,
          as: "sub_category",
          // attributes: ['id', 'name']
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
