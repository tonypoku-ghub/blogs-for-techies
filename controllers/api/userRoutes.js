const router = require("express").Router();
const { User } = require("../../models");

router.post("/login", async (req, res) => {
  console.log("userRoutes.login");
  let userData;
  let isNew;

  console.log("req.body", req.body);

  try {
    userData = await User.findOne({
      where: { username: req.body.username },
    });

    //If this is a sign up request
    if (!userData) {
      userData = await User.create(req.body);

      console.log("Login/Signup", "New user created");
      console.log("userData", userData.get({ plain: true }));
    } else {
      userData = await User.findOne({
        where: { username: req.body.username },
      });

      if (!userData) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      const validPassword = await userData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to process login" });
  }
});

router.post("/logout", (req, res) => {
  try {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to process login" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
