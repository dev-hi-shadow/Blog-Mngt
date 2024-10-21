const { BlgComments } = require("../../models");

exports.addComment = async (req, res, next) => {
  try {
    const comment = await BlgComments.create({
      ...req.body,
      created_by: req.user_id,
    });
    res.status(201).json({
      status: 201,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.body;
    const comment = await BlgComments.update(
      {
        ...req.body,
        updated_by: req.user_id,
      },
      {
        where: { id },
      }
    );
    res.status(201).json({
      status: 200,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.body;
    await BlgComments.destroy({
      where: { id },
      individualHooks: true,
      deleted_by: req.user_id,
    });
    res.status(201).json({
      status: 200,
      message: "Comment deleted successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

