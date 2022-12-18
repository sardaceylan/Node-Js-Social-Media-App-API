const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Hesap bilgileri güncellendi");
    } catch (error) {
      res.json(error);
    }
  } else {
    return res
      .status(403)
      .json("Sadece kendi hesabında güncelleme yapabilirsin!");
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json("Hesap silindi.");
    } catch (error) {
      res.json(error);
    }
  } else {
    return res.status(403).json("Sadece kendi hesabını silebilirsin!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const followingUser = await User.findById(req.params.id);
      const followerUser = await User.findById(req.body.userId);
      if (!followingUser.followers.includes(req.body.userId)) {
        await followingUser.updateOne({
          $push: { followers: req.body.userId },
        });
        await followerUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("kullanıcı takip edildi!");
      } else {
        res.status(403).json("bu kullanıcıyı zaten takip ediyorsun!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("kendini takip edemezsin!");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const followingUser = await User.findById(req.params.id);
      const followerUser = await User.findById(req.body.userId);
      if (followingUser.followers.includes(req.body.userId)) {
        await followingUser.updateOne({
          $pull: { followers: req.body.userId },
        });
        await followerUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("kullanıcı takipten çıkıldı!");
      } else {
        res.status(403).json("bu kullanıcıyı zaten takip etmiyorsun!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("kendini takipten çıkamazsın!");
  }
});

module.exports = router;
