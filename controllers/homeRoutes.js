const router = require("express").Router();
const { Blog, User } = require("../models");
const BlogComment = require("../models/BlogComment");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  console.log("homeRoutes called");

  const blogData = await Blog.findAll({
    include: [
      {
        model: User,
        as: "blog_author",
        attributes: ["username"],
      },
    ],
  });

  const blogs = blogData.map((blog) => {
    return blog.get({ plain: true });
  });

  console.log("blogs", blogs);

  try {
    res.render("homepage", { blogs });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/blogs/:id", withAuth, async (req, res) => {
  console.log("HomeRoute.get.blog:id");
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "blog_author",
          attributes: ["username"],
        },
        {
          model: BlogComment,
          include: [
            { model: User, as: "comment_author", attributes: ["username"] },
          ],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    console.log("blog", blog);

    res.render("blog", {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Failed to retrieve blog with id = ${req.params.id}` });
  }
});

// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Blog, as: "author_blogs" }],
    });

    const user = userData.get({ plain: true });

    console.log("user", user);
    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Your dashboard failed to display" });
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

module.exports = router;
