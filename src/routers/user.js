const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const {
  sendWelcomeEmail,
  sendEmailOnDeleteAccount,
} = require("../emails/account");
const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send("Logged out successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged out successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (
      file.originalname.endsWith(".jpg") ||
      file.originalname.endsWith(".jpeg") ||
      file.originalname.endsWith(".png")
    ) {
      return callback(null, true);
    }

    callback(new Error("File must be either a jpg, jpeg or png"));
  },
});

//USER IMAGE UPLOAD
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send("Image uploaded successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ error: "No user found" });
    }
    res.send(user);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});

// FETCHING PROFILE PICURES
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Not found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const isValidUpdates = ["name", "email", "password", "age"];

  const allowedUpdates = updates.every((update) =>
    isValidUpdates.includes(update)
  );
  if (!allowedUpdates) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendEmailOnDeleteAccount(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});

//DELETE AVATAR
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      throw new Error("No avatar to be deleted");
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Avatar deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
