const router = require("express").Router();
const { Blog, BlogComment } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/comment", withAuth, async (req, res) => {
  console.log("req.session", req.session);

  try {
    const newBlogCommentData = await BlogComment.create({
      ...req.body,
      author: req.session.user_id,
    });

    const blogComment = newBlogCommentData.get({ plain: true });

    console.log("blogComment", blogComment);

    res.status(200).json(blogComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/", withAuth, async (req, res) => {
  console.log("blogRoutes.post");
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
