const User = require("./User");
const Blog = require("./Blog");
const BlogComment = require("./BlogComment");

User.hasMany(Blog, {
  foreignKey: "user_id",
  as: "author_blogs",
  onDelete: "CASCADE",
});

Blog.belongsTo(User, {
  foreignKey: "user_id",
  as: "blog_author",
});

User.hasMany(BlogComment, {
  foreignKey: "author",
  as: "comment_author",
  onDelete: "CASCADE",
});

BlogComment.belongsTo(User, {
  foreignKey: "author",
  as: "comment_author",
});

Blog.hasMany(BlogComment, {
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

BlogComment.belongsTo(Blog, {
  foreignKey: "blog_id",
});

module.exports = { User, Blog, BlogComment };
