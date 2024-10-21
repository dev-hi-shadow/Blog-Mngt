const BlgComments = require("../modules/blg_comments/model.js");
const Blogs = require("../modules/blogs/model.js");
const Categories = require("../modules/categories/model.js");
const Roles = require("../modules/roles/model.js");
const SubCategories = require("../modules/sub-categories/model.js");
const Users = require("../modules/users/model");

const db = {
  Roles,
  Users,
  Categories,
  SubCategories,
  Blogs,
  BlgComments,

};


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
