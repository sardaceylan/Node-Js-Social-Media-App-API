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
      const user = await User.findByIdAndDelete(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Hesap silindi.");
    } catch (error) {
      res.json(error);
    }
  } else {
    return res.status(403).json("Sadece kendi hesabını silebilirsin!");
  }
});

module.exports = router;
